#!/usr/bin/env bash

PHPMD_CONFIG=.gitlab/phpmd.xml

if test -f ".config/phpmd.xml"; then
  PHPMD_CONFIG=.config/phpmd.xml
fi

if [[ -f vendor/bin/phpmd ]]; then
  vendor/bin/phpmd "$@" text "$PHPMD_CONFIG" \
    --reportfile=./.reports/phpmd-custom.txt \
    --exclude=*/vendor/* \
    --exclude=*/Packages/Libraries/*
else
  if [[ -f Packages/Libraries/bin/phpmd ]]; then
    Packages/Libraries/bin/phpmd "$@" text "$PHPMD_CONFIG" \
      --reportfile=./.reports/phpmd-custom.txt \
      --exclude=*/vendor/* \
      --exclude=*/Packages/Libraries/*
  else
    phpmd "$@" text "$PHPMD_CONFIG" \
      --reportfile=./.reports/phpmd-custom.txt \
      --exclude=*/vendor/* \
      --exclude=*/Packages/Libraries/*
  fi
fi
