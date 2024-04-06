import asyncio

from rest_framework import serializers, viewsets, mixins, permissions, status
from rest_framework.response import Response

from pong.utils import (
    CustomError,
    CookieTokenAuthentication,
    wrap_data,
    CustomPageNumberPagination,
)
from socketcontrol.events import sio
from livegame.gameroom_session import (
    GameRoomSession,
    GAMEROOMSESSION_REGISTRY,
)
from .models import Game, GameRoom, GamePlayer, SubGame
from .databaseio import get_single_game_room, create_game
from .serializers import (
    GameSerializer,
    GameRoomSerializer,
    GamePlayerSerializer,
    SubGameSerializer,
)


def get_game_room(game_id):
    try:
        return GameRoom.objects.get(id=game_id)
    except GameRoom.DoesNotExist:
        return None


def delete_game_room(game_room):
    try:
        if not game_room.is_playing:
            game = game_room.game
            game.delete()
        else:
            game_room.delete()
    except Exception as e:
        raise CustomError(e, status_code=status.HTTP_400_BAD_REQUEST) from e


class IsPlayerInGameRoom(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.game.game_player.filter(user=request.user).exists()


class GameRoomViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = GameRoom.objects.all()
    serializer_class = GameRoomSerializer
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsPlayerInGameRoom]
    pagination_class = CustomPageNumberPagination

    def list(self, request, *_, **__):
        try:
            paginator = CustomPageNumberPagination()
            filter_val = request.query_params.get("filter", None)
            if filter_val:
                if filter_val not in ["tournament", "dual"]:
                    raise CustomError(
                        exception='Invalid filter value. Expected "tournament" or "dual"',
                        status_code=status.HTTP_400_BAD_REQUEST,
                    )
                game_rooms = GameRoom.objects.filter(
                    game__is_tournament=filter_val == "tournament"
                ).order_by("id")
            else:
                game_rooms = GameRoom.objects.all().order_by("id")
            context = paginator.paginate_queryset(game_rooms, request)
            data = []
            for game_room in context:
                game_room_serializer = GameRoomSerializer(game_room)
                game_serializer = GameSerializer(game_room.game)
                players = game_room.game.game_player.all().order_by("id")
                players_serializer = GamePlayerSerializer(players, many=True)
                data.append(
                    {
                        "game": game_serializer.data,
                        "room": game_room_serializer.data,
                        "players": players_serializer.data,
                    }
                )
            return paginator.get_paginated_response(data)
        except Exception as e:
            raise CustomError(
                e, "game_room", status_code=status.HTTP_400_BAD_REQUEST
            ) from e

    def retrieve(self, request, *args, **kwargs):
        try:
            room_id = kwargs["pk"]
            game_room = GameRoom.objects.get(id=room_id)
            self.check_object_permissions(request, game_room)
            data = get_single_game_room(room_id)
            my_player_id = game_room.game.game_player.get(user=request.user).id
            data["my_player_id"] = my_player_id
            return Response({"data": data}, status=status.HTTP_200_OK)
        except Exception as e:
            raise CustomError(
                e, "game_room", status_code=status.HTTP_400_BAD_REQUEST
            ) from e

    def create(self, request, *args, **kwargs):
        game = None
        try:
            request_data = request.data.get("data")
            game = create_game(request.user, request_data.get("game"))
            game_room = self.create_room(request, request_data, game)
            GAMEROOMSESSION_REGISTRY[game_room.id] = GameRoomSession(game)
            sio.register_namespace(GAMEROOMSESSION_REGISTRY[game_room.id])
            player = self.join_host(game_room)
            data = self.serialize_game_and_room(game, game_room)
            data.update({"players": [GamePlayerSerializer(player).data]})
            data.update({"my_player_id": player.id})
            data.update({"am_i_host": True})
            return Response(
                {"data": data},
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            if game:
                game.delete()
            raise CustomError(
                e, "game_room", status_code=status.HTTP_400_BAD_REQUEST
            ) from e

    def destroy(self, request, *args, **kwargs):
        if not kwargs.get("pk"):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        game_room = get_game_room(kwargs["pk"])
        if not game_room:
            return Response(status=status.HTTP_404_NOT_FOUND)
        delete_game_room(game_room)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def create_room(self, request, request_data, game):
        try:
            room_data = request_data.get("room")
            room_data["game"] = game.game_id
            user = request.user
            room_data["host"] = user.intra_id
            serializer = GameRoomSerializer(data=room_data)
            serializer.is_valid(raise_exception=True)
            game_room = serializer.save()
            return game_room
        except Exception as e:
            raise CustomError(e, status_code=status.HTTP_400_BAD_REQUEST) from e

    def join_host(self, game_room):
        try:
            host = game_room.host
            game = game_room.game
            player_data = {"user": host, "game": game.game_id}
            serializer = GamePlayerSerializer(data=player_data)
            serializer.is_valid(raise_exception=True)
            player = serializer.save()
            game_room.join_players += 1
            game_room.save()
            return player
        except Exception as e:
            raise CustomError(e, status_code=status.HTTP_400_BAD_REQUEST) from e

    def serialize_game_and_room(self, game, room):
        game_serializer = GameSerializer(game)
        room_serializer = GameRoomSerializer(room)
        return {"game": game_serializer.data, "room": room_serializer.data}


class PlayerViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = GamePlayer.objects.all()
    serializer_class = GamePlayerSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CookieTokenAuthentication]

    def list(self, request, *_, **__):
        try:
            game_id = request.query_params.get("game_id", None)
            if not game_id:
                raise CustomError(
                    "game_id query string is required",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
            players = GamePlayer.objects.filter(game=game_id).order_by("id")
            serializer = GamePlayerSerializer(players, many=True)
            return Response(
                wrap_data(players=serializer.data), status=status.HTTP_200_OK
            )
        except Exception as e:
            raise CustomError(
                e, "game_player", status_code=status.HTTP_400_BAD_REQUEST
            ) from e

    def retrieve(self, request, *args, **kwargs):
        try:
            player_id = kwargs["pk"]
            player = GamePlayer.objects.get(pk=player_id)
            serializer = GamePlayerSerializer(player)
            return Response(
                wrap_data(player=serializer.data), status=status.HTTP_200_OK
            )
        except Exception as e:
            raise CustomError(
                e, "game_player", status_code=status.HTTP_400_BAD_REQUEST
            ) from e

    def create(self, request, *args, **kwargs):
        try:
            game_id = request.data.get("data").get("game_id")
            if not game_id:
                raise CustomError(
                    "game_id is required", status_code=status.HTTP_400_BAD_REQUEST
                )
            game = Game.objects.get(game_id=game_id)
            game_room = game.game_room
            if game_room.is_playing:
                raise CustomError(
                    "The game room is already started",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
            if self.user_already_in_same_game_room(request.user, game):
                return self.return_response(request.user, game)
            if game.n_players == game_room.join_players:
                raise CustomError(
                    "The game room is full",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
            if self.user_already_in_other_game_room(request.user, game):
                raise CustomError(
                    "The user is already participating",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
            user = request.user
            request.data["game"] = game_id
            request.data["user"] = user.intra_id
            serializer = GamePlayerSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            game_room.join_players += 1
            game_room.save()
            return self.return_response(user, game)
        except Exception as e:
            if isinstance(e, serializers.ValidationError):
                raise CustomError(
                    "The player is already participating",
                    status_code=status.HTTP_400_BAD_REQUEST,
                ) from e
            raise CustomError(e, "game", status_code=status.HTTP_400_BAD_REQUEST) from e

    def destroy(self, request, *args, **kwargs):
        try:
            player_id = kwargs["pk"]
            user = request.user
            if not player_id:
                raise CustomError(
                    "player_id is required", status_code=status.HTTP_400_BAD_REQUEST
                )
            player = GamePlayer.objects.get(pk=player_id)
            if player.user != user:
                raise CustomError(
                    "You are not the user of the player",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
            game = player.game
            game_room = game.game_room
            if game_room.host == player.user:
                game.delete()
                game_room_ns = GAMEROOMSESSION_REGISTRY[game_room.id]
                asyncio.run(game_room_ns.emit_destroyed("host_left"))
                return Response(
                    {"message": "The host left the game room"},
                    status=status.HTTP_204_NO_CONTENT,
                )
            if not game_room.is_playing:
                player = GamePlayer.objects.get(game=game, user=user)
                player.delete()
                game_room.join_players -= 1
                if game_room.join_players == 0:
                    delete_game_room(game_room)
                    return Response(status=status.HTTP_204_NO_CONTENT)
                game_room.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
            raise CustomError(
                "The game is already started",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            raise CustomError(
                e, "game room", status_code=status.HTTP_400_BAD_REQUEST
            ) from e

    def user_already_in_same_game_room(self, user, game):
        if (
            GamePlayer.objects.filter(user=user, game=game).exists()
            and not game.game_room.is_playing
        ):
            return True
        return False

    def user_already_in_other_game_room(self, user, game):
        if GamePlayer.objects.filter(user=user, game=game).exists():
            return True
        if game.game_room.is_playing:
            return True
        return False

    def return_response(self, user, game):
        players = game.game_player.all().order_by("id")
        my_player_id = game.game_player.get(user=user).id
        players_serializer = GamePlayerSerializer(players, many=True)
        game_serializer = GameSerializer(game)
        game_room_serializer = GameRoomSerializer(game.game_room)
        my_player_id = game.game_player.get(user=user).id
        am_i_host = game.game_room.host == user

        return Response(
            wrap_data(
                game=game_serializer.data,
                room=game_room_serializer.data,
                players=players_serializer.data,
                my_player_id=my_player_id,
                am_i_host=am_i_host,
            ),
            status=status.HTTP_201_CREATED,
        )


class SubGameViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = SubGame.objects.all()
    serializer_class = SubGameSerializer
