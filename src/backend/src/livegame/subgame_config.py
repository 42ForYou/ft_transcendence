import math
import os
import logging

from game.models import Game


logger = logging.getLogger(f"{__package__}.{__name__}")


class SubGameConfig:
    def __init__(
        self,
        width: float,
        height: float,
        match_point: int,
        player_a_init_point: int,
        player_b_init_point: int,
        paddle_len: float,
        paddle_len_margin: float,
        paddle_speed: float,
        paddle_init_y: float,
        paddle_friction_coef: float,
        epsilon: float,  # expected floating point error
        network_max_deviation: float,
        ball_init_x: float,
        ball_init_y: float,
        ball_speed: float,
        time_limit: float,
        delay_time_before_rank_start: float,
        delay_time_before_subgame_start: float,
        delay_time_after_scoring: float,
        delay_time_after_rank_end: float,
        network_max_retries: int,
        network_delay_between_retries: float,
    ) -> None:
        self.width = width
        self.height = height
        self.match_point = match_point
        self.player_a_init_point = player_a_init_point
        self.player_b_init_point = player_b_init_point
        self.x_max = width / 2
        self.x_min = -width / 2
        self.y_max = height / 2
        self.y_min = -height / 2
        self.l_paddle = paddle_len
        self.l_paddle_m = paddle_len_margin
        self.v_paddle = paddle_speed
        self.y_paddle_init = paddle_init_y
        self.u_paddle = paddle_friction_coef
        self.e = abs(epsilon)
        self.e_net = abs(network_max_deviation)
        self.x_ball_init = ball_init_x
        self.y_ball_init = ball_init_y
        self.v_ball = ball_speed
        self.t_limit = time_limit
        self.t_delay_rank_start = delay_time_before_rank_start
        self.t_delay_subgame_start = delay_time_before_subgame_start
        self.t_delay_scoring = delay_time_after_scoring
        self.t_delay_rank_end = delay_time_after_rank_end
        self.max_retry_network = network_max_retries
        self.t_delay_retry_network = network_delay_between_retries

        for key, value in self.__dict__.items():
            logger.info(f"SubGameConfig {key}: {value}")

    def __str__(self) -> str:
        return f"SubGameConfig {self.width} * {self.height}"

    # Checks whether two numbers can be considered equal (difference is within epsilon)
    def flt_eq(self, a: float, b: float) -> bool:
        return math.isclose(a, b, abs_tol=self.e)


sgc_width = os.environ.get("SUBGAMECONFIG_WIDTH", "800")
sgc_height = os.environ.get("SUBGAMECONFIG_HEIGHT", "600")
sgc_player_a_init_point = os.environ.get("SUBGAMECONFIG_PLAYER_A_INIT_POINT", "0")
sgc_player_b_init_point = os.environ.get("SUBGAMECONFIG_PLAYER_B_INIT_POINT", "0")
sgc_paddle_len = os.environ.get("SUBGAMECONFIG_PADDLE_LENGTH", "50")
sgc_paddle_len_margin = os.environ.get("SUBGAMECONFIG_PADDLE_MARGIN", "5")
sgc_paddle_speed = os.environ.get("SUBGAMECONFIG_PADDLE_SPEED", "100")
sgc_paddle_init_y = os.environ.get("SUBGAMECONFIG_PADDLE_INIT_Y", "0")
sgc_paddle_friction_coef = os.environ.get("SUBGAMECONFIG_FRICTION_COEF", "0.1")
sgc_epsilon = os.environ.get("SUBGAMECONFIG_EPSILON", "1")
sgc_network_max_deviation = os.environ.get("SUBGAMECONFIG_NETWORK_MAX_DEVIATION", "10")
sgc_ball_init_x = os.environ.get("SUBGAMECONFIG_BALL_INIT_X", "0")
sgc_ball_init_y = os.environ.get("SUBGAMECONFIG_BALL_INIT_Y", "0")
sgc_ball_speed = os.environ.get("SUBGAMECONFIG_BALL_SPEED", "200")
sgc_delay_time_before_rank_start = os.environ.get(
    "SUBGAMECONFIG_DELAY_TIME_BEFORE_RANK_START", "5"
)
sgc_delay_time_before_subgame_start = os.environ.get(
    "SUBGAMECONFIG_DELAY_TIME_BEFORE_SUBGAME_START", "3"
)
sgc_delay_time_after_scoring = os.environ.get(
    "SUBGAMECONFIG_DELAY_TIME_AFTER_SCORING", "3"
)
sgc_delay_time_after_rank_end = os.environ.get(
    "SUBGAMECONFIG_DELAY_TIME_AFTER_RANK_END", "5"
)
sgc_network_max_retries = os.environ.get("SUBGAMECONFIG_NETWORK_MAX_RETRIES", "5")
sgc_network_delay_between_retries = os.environ.get(
    "SUBGAMECONFIG_NETWORK_DELAY_BETWEEN_RETRIES", "3"
)


def get_default_subgame_config(game: Game) -> SubGameConfig:
    return SubGameConfig(
        width=float(sgc_width),
        height=float(sgc_height),
        match_point=game.game_point,
        player_a_init_point=int(sgc_player_a_init_point),
        player_b_init_point=int(sgc_player_b_init_point),
        paddle_len=float(sgc_paddle_len),
        paddle_len_margin=float(sgc_paddle_len_margin),
        paddle_speed=float(sgc_paddle_speed),
        paddle_init_y=float(sgc_paddle_init_y),
        paddle_friction_coef=float(sgc_paddle_friction_coef),
        epsilon=float(sgc_epsilon),
        network_max_deviation=float(sgc_network_max_deviation),
        ball_init_x=float(sgc_ball_init_x),
        ball_init_y=float(sgc_ball_init_y),
        ball_speed=float(sgc_ball_speed),
        time_limit=game.time_limit,
        delay_time_before_rank_start=float(sgc_delay_time_before_rank_start),
        delay_time_before_subgame_start=float(sgc_delay_time_before_subgame_start),
        delay_time_after_scoring=float(sgc_delay_time_after_scoring),
        delay_time_after_rank_end=float(sgc_delay_time_after_rank_end),
        network_max_retries=int(sgc_network_max_retries),
        network_delay_between_retries=float(sgc_network_delay_between_retries),
    )
