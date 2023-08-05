#!/bin/sh

PROJECT=$(php -r "echo dirname(dirname(dirname(realpath('$0'))));")
STAGED_FILES_CMD=$(git diff --cached --name-only --diff-filter=ACMR HEAD | grep \\.php)

# Determine if a file list is passed
if [ "$#" -eq 1 ]; then
  oIFS=$IFS
  IFS='
    '
  SFILES="$1"
  IFS=$oIFS
fi
SFILES=${SFILES:-$STAGED_FILES_CMD}

echo "Checking PHP Lint..."
for FILE in $SFILES; do
  php -l -d display_errors=0 $PROJECT/$FILE
  if [ $? != 0 ]; then
    echo "Fix PHP lint error before commit."
    exit 1
  fi
  FILES="$FILES $PROJECT/$FILE"
done

if [ "$FILES" != "" ]; then
  echo "Running Code Sniffer."
  ./.gitlab/local/phpcs.sh $FILES
  if [ $? != 0 ]; then
    echo "Fix PHPCS error before commit!"
    exit 1
  fi
fi

if [ "$FILES" != "" ]; then
  echo "Running PHP Mess Detector."
  for FILE in $FILES; do
    ./.gitlab/local/phpmd.sh $FILE
    if [ $? != 0 ]; then
      echo "Fix PHPMD error before commit!"
      exit 1
    fi
  done
fi

if [ "$FILES" != "" ]; then
  echo "Running PHPStan static analyzer."
  composer install --prefer-source
  ./.gitlab/local/phpstan.sh $FILES
  if [ $? != 0 ]; then
    echo "Fix PHPStan error before commit!"
    exit 1
  fi
fi

if [ "$FILES" != "" ] && [ -f package.json ]; then
  echo "Running SASS-Linter"
  ./.gitlab/local/sass-lint.sh $FILES
  if [ $? != 0 ]; then
    echo "Fix SASS error before commit!"
    exit 1
  fi
fi

exit $?
