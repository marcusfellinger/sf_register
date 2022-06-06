#!/usr/bin/env bash
pwd
ls /
find / -type d

mkdir -p "$(pwd)/.reports"

[ -f ./.config/phpstan-server-${PROJECT_TYPE}.neon ] && RULESET_PATH=./.config/phpstan-server-${PROJECT_TYPE}.neon || RULESET_PATH=./.gitlab/phpstan-server-${PROJECT_TYPE}.neon
[ -f ./.config/phpstan.neon ] && RULESET_PATH=./.config/phpstan.neon || RULESET_PATH=${RULESET_PATH}

~/.composer/vendor/bin/phpstan analyze \
  -c ${RULESET_PATH} \
  $(pwd)/extensions
