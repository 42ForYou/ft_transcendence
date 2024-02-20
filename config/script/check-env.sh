#!/bin/bash

set -e

BOLD_RED="\033[1;31m"
BOLD_GREEN="\033[1;32m"
BOLD_YELLOW="\033[1;33m"
BOLD_BLUE="\033[1;34m"
BOLD_MAGENTA="\033[1;35m"
BOLD_CYAN="\033[1;36m"
NO_COLOR="\033[0m"

GRAY="\033[90m"
RED="\033[91m"
GREEN="\033[92m"
YELLOW="\033[93m"
BLUE="\033[94m"
MAGENTA="\033[95m"
CYAN="\033[96m"
WHITE="\033[97m"
DEF_COLOR="\033[39m"

ENV_MUST="$1"
ENV="$2"
TARGET="$3"

# 파일 경로 검증 함수
validate_file() {
	if [ ! -f "$1" ]; then
		echo -e "Error: ${RED}$1${NO_COLOR} File path is incorrect or file does not exist."
		exit 1
	fi
}

# 파일 경로 검증
validate_file "$ENV_MUST"
validate_file "$ENV"

echo -e "Checking ${BLUE}$TARGET${NO_COLOR} file..."

# .env 파일에서 키 추출
keys_in_env=$(grep -oE '^[^#=]+' "$ENV")

# $ENV_MUST 에 나열된 각 키가 $ENV 파일에 있는지 확인
missing_keys=0
while IFS= read -r line; do
    # '#'로 시작하거나 비어 있는 줄 무시
    if [[ "$line" =~ ^# ]] || [[ -z "$line" ]]; then
        continue
    fi

    # 키만 추출 (값 포함)
    key=$(echo "$line" | cut -d '=' -f 1)
    # .env 파일에서 해당 키의 값 확인
    value=$(grep "^$key=" "$ENV" | cut -d '=' -f 2-)

    if [[ -z "$value" ]]; then
        echo -e "Missing or empty value for key in $ENV: ${BOLD_RED}$key${NO_COLOR}"
        missing_keys=$((missing_keys + 1))
    fi
done < "$ENV_MUST"

if [ "$missing_keys" -eq 0 ]; then
	echo -e "  ✅ All keys in ${GREEN}[$ENV]${NO_COLOR} are present in $TARGET. ${GREEN}[$ENV_MUST]${NO_COLOR} is satisfied."
else
	echo -e "  There are ${YELLOW}$missing_keys missing key(s)${NO_COLOR} in $TARGET."
	exit 1
fi
