#!/usr/bin/env bash
pwd
ls /
find / -type d

mkdir -p "$(pwd)/.reports"

[ -f ./.config/phpmd.xml ] && PHPMD_CONFIG=$(pwd)/.config/phpmd.xml || PHPMD_CONFIG=$(pwd)/.gitlab/phpmd.xml

~/.composer/vendor/bin/phpmd \
  $(pwd)/extensions/ text "$PHPMD_CONFIG" \
  --reportfile=$(pwd)/.reports/phpmd-custom.txt \
  --exclude=*/vendor/* \
  --exclude=*/Packages/Libraries/*
