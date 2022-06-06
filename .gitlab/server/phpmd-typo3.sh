#!/usr/bin/env bash
pwd
ls /
find / -type d

mkdir -p "$(pwd)/.reports"

[ -f ./.config/phpmd.xml ] && PHPMD_CONFIG=/app/.config/phpmd.xml || PHPMD_CONFIG=/app/.gitlab/phpmd.xml

~/.composer/vendor/bin/phpmd \
  /app/extensions/ text "$PHPMD_CONFIG" \
  --reportfile=/app/.reports/phpmd-custom.txt \
  --exclude=*/vendor/* \
  --exclude=*/Packages/Libraries/*
