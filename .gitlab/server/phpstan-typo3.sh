#!/usr/bin/env bash
if [[ "$USE_PHPSTAN" == "1" ]]; then
  [ -f ./.config/phpstan-server-${PROJECT_TYPE}.neon ] && RULESET_PATH=./.config/phpstan-server-${PROJECT_TYPE}.neon || RULESET_PATH=./.gitlab/phpstan-server-${PROJECT_TYPE}.neon
  [ -f ./.config/phpstan.neon ] && RULESET_PATH=./.config/phpstan.neon || RULESET_PATH=${RULESET_PATH}

  docker run -v $(pwd):/app ghcr.io/phpstan/phpstan:1.5.4 analyze \
  -c ${RULESET_PATH} \
  /app/extensions
fi
