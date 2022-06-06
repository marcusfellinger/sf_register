#!/usr/bin/env bash
mkdir -p ./.reports

[ -f ./.config/ruleset.xml ] && RULESET_PATH=./.config/ruleset.xml || RULESET_PATH=./.gitlab/ruleset-${PROJECT_TYPE}.xml

phpcs \
  --report-full \
  --report-checkstyle=./.reports/phpcs-checkstyle.txt \
  --report-code=./.reports/phpcs-code.txt \
  --report-csv=./.reports/phpcs.csv \
  --report-emacs=./.reports/phpcs-emacs.txt \
  --report-gitblame=./.reports/phpcs-blame.txt \
  --report-summary=./.reports/phpcs-summary.txt \
  --report-info=./.reports/phps-info.txt \
  --report-source=./.reports/phpcs-source.txt \
  --ignore=**/vendor/** \
  -n --extensions=php --standard=${RULESET_PATH} -p \
  "$@"
