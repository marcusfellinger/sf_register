#!/usr/bin/env bash
[ -f ./.config/phpstan.neon ] && RULESET_PATH=./.config/phpstan.neon || RULESET_PATH=./.gitlab/phpstan-local.neon

if [[ -f vendor/bin/phpstan ]]; then
  vendor/bin/phpstan analyze --autoload-file=vendor/autoload.php -c ${RULESET_PATH} "$@"
else
  if [[ -f Packages/Libraries/bin/phpstan ]]; then
    Packages/Libraries/bin/phpstan analyze --autoload-file=Packages/Libraries/autoload.php -c ${RULESET_PATH} "$@"
  else
    phpstan analyze --autoload-file=vendor/autoload.php -c ${RULESET_PATH} "$@"
  fi
fi
