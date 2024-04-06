from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import User, Profile


class UserSerializer(serializers.ModelSerializer):
    intra_id = serializers.CharField(
        max_length=32, validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ("intra_id",)

    def create(self, validated_data):
        validated_data["username"] = validated_data["intra_id"]
        user = User.objects.create_user(**validated_data)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    intra_id = serializers.CharField(source="user.intra_id", read_only=True)

    class Meta:
        model = Profile
        fields = ("intra_id", "nickname", "email", "avatar", "two_factor_auth")

    def validate(self, attrs):
        errors = {}
        if "nickname" in attrs:
            nickname = attrs.get("nickname")
            if not (self.instance and self.instance.nickname == nickname):
                if Profile.objects.filter(nickname=attrs["nickname"]).exists():
                    errors["nickname"] = ["This nickname is already taken."]
        if "email" in attrs:
            email = attrs.get("email")
            if not (self.instance and self.instance.email == email):
                if Profile.objects.filter(email=attrs["email"]).exists():
                    errors["email"] = ["This email is already taken."]
        if errors:
            raise serializers.ValidationError(errors)
        return attrs


class ProfileNotOwnerSerializer(serializers.ModelSerializer):
    intra_id = serializers.CharField(source="user.intra_id", read_only=True)

    class Meta:
        model = Profile
        fields = ("intra_id", "nickname", "avatar")
