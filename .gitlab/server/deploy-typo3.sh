#!/usr/bin/env bash
apk add bind-tools openssh-client

echo "CI_ENVIRONMENT_NAME=$CI_ENVIRONMENT_NAME"
if [[ -z "$CI_ENVIRONMENT_NAME" ]] ; then echo "CI_ENVIRONMENT_NAME is not defined" ; exit 1 ; fi

ENVIRONMENT=$(echo "$CI_ENVIRONMENT_NAME" | tr '[:lower:]' '[:upper:]')
[[ "$ENVIRONMENT" == "DEVELOPMENT" ]] && ENVIRONMENT=DEV

echo "ENVIRONMENT=$ENVIRONMENT"
if [[ -z "$ENVIRONMENT" ]]; then echo "ENVIRONMENT is not defined" ; exit 2; fi

PATH_VAR="${ENVIRONMENT}_PATH"
echo "PATH_VAR=$PATH_VAR"
if [[ -z "$PATH_VAR" ]]; then echo "${ENVIRONMENT}_PATH is not defined" ; exit 3; fi

PHP_CMD_VAR="${ENVIRONMENT}_PHP_CMD"
echo "PHP_CMD_VAR=$PHP_CMD_VAR"
if [[ -z "$PHP_CMD_VAR" ]]; then echo "${ENVIRONMENT}_PHP_CMD is not defined" ; exit 4; fi

PHP_DIR_VAR="${ENVIRONMENT}_PHP_DIR"
echo "PHP_DIR_VAR=$PHP_DIR_VAR"
if [[ -z "$PHP_DIR_VAR" ]]; then echo "${ENVIRONMENT}_PHP_DIR is not defined" ; exit 5; fi

USER_VAR="${ENVIRONMENT}_USER"
echo "USER_VAR=$USER_VAR"
if [[ -z "$USER_VAR" ]]; then echo "${ENVIRONMENT}_USER is not defined" ; exit 6; fi

COMPOSER_BASE_VAR="${ENVIRONMENT}_COMPOSER_BASE"
echo "COMPOSER_BASE_VAR=$COMPOSER_BASE_VAR"
if [[ -z "${!COMPOSER_BASE_VAR}" ]]; then echo "${ENVIRONMENT}_COMPOSER_BASE is not defined" ; exit 7; fi

COMPOSER_BASE_DIR=${!COMPOSER_BASE_VAR}
echo "COMPOSER_BASE_DIR=$COMPOSER_BASE_DIR"

if [[ -z "$COMPOSER_BASE_DIR" ]]; then echo "${ENVIRONMENT}_COMPOSER_BASE is not defined" ; exit 8; fi
if [[ -z "$COMPOSER_VERSION" ]]; then echo "COMPOSER_VERSION is not defined" ; exit 9; fi
if [[ -z "$TYPO3_BIN_DIR" ]]; then echo "TYPO3_BIN_DIR is not defined" ; exit 10 ; fi

COMPOSER_DIR="${!COMPOSER_BASE_VAR}/${COMPOSER_VERSION}"
echo "COMPOSER_DIR=$COMPOSER_DIR"

PHP_CMD=${!PHP_CMD_VAR}
echo "PHP_CMD=$PHP_CMD"

PHP_DIR=${!PHP_DIR_VAR}
echo "PHP_DIR=$PHP_DIR"

TARGETPATH=${!PATH_VAR}
echo "TARGETPATH=$TARGETPATH"

USER=${!USER_VAR}
echo "USER=$USER"

if [[ -z "$PHP_CMD" ]]; then echo "$PHP_CMD_VAR is not defined" ; exit 11; fi
if [[ -z "$PHP_DIR" ]]; then echo "$PHP_DIR_VAR is not defined" ; exit 12; fi
if [[ -z "$TARGETPATH" ]]; then echo "$PATH_VAR is not defined" ; exit 13; fi
if [[ -z "$USER" ]]; then echo "$USER_VAR is not defined" ; exit 14; fi
if [[ -z "$CI_ENVIRONMENT_URL" ]]; then echo "CI_ENVIRONMENT_URL is not defined" ; exit 15; fi

DOMAIN_EXIST=$(dig +noall +answer -t A $CI_ENVIRONMENT_URL)
echo "DOMAIN_EXIST=$DOMAIN_EXIST"

if [[ "$PROJECT_TYPE" != "typo3" ]]; then echo "Only for TYPO3 deployment" ; exit 16 ; fi
if [[ -z "$DOMAIN_EXIST" ]]; then echo "Target-Domain: $CI_ENVIRONMENT_URL not found" ; exit 17 ; fi

IP=$(ping -c 1 $CI_ENVIRONMENT_URL | grep "from" | sed -e "s#.* from \(.*\): .*#\1#")
echo "IP=$IP"

if [[ -z "$IP" ]]; then echo "Error in DNS resolution" ; exit 18 ; fi

echo "Deploying $CI_COMMIT_BRANCH to $CI_ENVIRONMENT_URL \($IP\) on $TARGETPATH as $USER"

echo "Perform TYPO3 Deployment"

COMPOSER_CMD="$COMPOSER_DIR/composer"
echo "COMPOSER_CMD=$COMPOSER_CMD"

if [[ "$CI_ENVIRONMENT_NAME" == "Live" ]];
then
  TYPO3_CONTEXT=Production
else
  if [[ "$CI_ENVIRONMENT_NAME" != "Development" ]]; then
    TYPO3_CONTEXT=Development/$CI_ENVIRONMENT_NAME
  else
    TYPO3_CONTEXT=$CI_ENVIRONMENT_NAME
  fi
fi

{
  echo "mkdir -p $TARGETPATH"
  echo "export PATH=$COMPOSER_DIR:$PHP_DIR:$PATH"
  echo "export TYPO3_CONTEXT=$TYPO3_CONTEXT"
  echo "if [[ ! -f $COMPOSER_CMD ]]; then echo \"$COMPOSER_CMD is not a file\" ; exit 19; fi"
  echo "if [[ ! -x $PHP_DIR/$PHP_CMD ]]; then echo \"$PHP_DIR/$PHP_CMD is not executable\" ; exit 20; fi"
  echo "if [[ ! -d $TARGETPATH ]]; then echo \"$TARGETPATH is not a directory\" ; exit 21; fi"
  echo "cd $TARGETPATH"
  echo "if [[ -z $CI_REPOSITORY_URL ]]; then echo \"REPOSITORY URL is not set\" ; exit 22; fi"
  echo "if [[ ! -d .git ]]; then git clone $CI_REPOSITORY_URL . || exit 23; fi"
  echo "git remote set-url origin $CI_REPOSITORY_URL"
  echo "if [[ -z $CI_COMMIT_BRANCH ]]; then echo \"$CI_COMMIT_BRANCH is not valid\" ; exit 24; fi"
  echo "git stash clear || exit 25"
  echo "git stash || exit 26"
  echo "git checkout $CI_COMMIT_BRANCH || exit 27"
  echo "git branch --set-upstream-to=origin/$CI_COMMIT_BRANCH $CI_COMMIT_BRANCH || exit 28"
  echo "git pull || exit 29"
  echo "git stash pop | 2>/dev/null"
  echo "git submodule sync || exit 30"
  echo "git submodule init || exit 31"
  echo "git submodule update || exit 32"
  echo "$COMPOSER_CMD config gitlab-token.gitlab.com ${GITLAB_COMPOSER_CONFIG_TOKEN} || exit 33"
  echo "if [[ ! -x $TYPO3_BIN_DIR/typo3cms ]]; then echo \"$TYPO3_BIN_DIR/typo3cms is not executable\" ; exit 34; fi"
  echo "$PHP_DIR/$PHP_CMD $COMPOSER_CMD install --no-dev --prefer-dist || exit 35"
  echo "$PHP_DIR/$PHP_CMD $TYPO3_BIN_DIR/typo3cms install:fixfolderstructure || exit 36"
  echo "$PHP_DIR/$PHP_CMD $TYPO3_BIN_DIR/typo3cms install:generatepackagestates || exit 37"
} > gitlab-deploy.sh

cat gitlab-deploy.sh

if [[ "$CI_ENVIRONMENT_NAME" != "Live" ]]; then
  scp -o StrictHostKeyChecking=no gitlab-deploy.sh $USER@$CI_ENVIRONMENT_URL:~/gitlab-deploy.sh &&
  ssh -o StrictHostKeyChecking=no $USER@$CI_ENVIRONMENT_URL "/bin/bash ~/gitlab-deploy.sh"
fi
