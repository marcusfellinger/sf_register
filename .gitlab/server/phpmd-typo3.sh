#!/usr/bin/env bash
mkdir -p "$(pwd)/.reports"

[ -f ./.config/phpmd.xml ] && PHPMD_CONFIG=/app/.config/phpmd.xml || PHPMD_CONFIG=/app/.gitlab/phpmd.xml

docker run -v "$(pwd)":/app 1drop/php-utils:$PHP_VERSION /composer/vendor/bin/phpmd \
  /app/extensions/ text "$PHPMD_CONFIG" \
  --reportfile=/app/.reports/phpmd-custom.txt \
  --exclude=*/vendor/* \
  --exclude=*/Packages/Libraries/*
