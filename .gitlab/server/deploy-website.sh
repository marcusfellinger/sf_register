#!/usr/bin/env bash
apk add bind-tools openssh-client
DOMAIN=$1
USER=$2
TARGETPATH=$3
BRANCH=$4
GIT_URL=$5
TYPE=$6
DOMAIN_EXIST=$(dig +noall +answer -t A $DOMAIN)

if [[ "$DOMAIN_EXIST" != "" ]]; then
  IP=$(ping -c 1 $DOMAIN | grep "from" | sed -e "s#.* from \(.*\): .*#\1#")

  echo "Deploying $BRANCH to $DOMAIN ($IP) on $TARGETPATH as $USER"

  if [[ "$BRANCH" == "live" ]]; then
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "mkdir -p $TARGETPATH"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git remote set-url origin $GIT_URL"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git checkout $BRANCH"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git branch --set-upstream-to=origin/$BRANCH $BRANCH"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git stash clear"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git stash"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git pull"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git submodule sync"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git submodule init"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git submodule update"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git stash pop"
  else
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "mkdir -p $TARGETPATH"
    ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "mkdir -p $TARGETPATH"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git remote set-url origin $GIT_URL"
    ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git remote set-url origin $GIT_URL"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git checkout $BRANCH"
    ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git checkout $BRANCH"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git branch --set-upstream-to=origin/$BRANCH $BRANCH"
    ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git branch --set-upstream-to=origin/$BRANCH $BRANCH"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git stash clear"
    ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git stash clear"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git stash"
    ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git stash"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git pull"
    ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git pull"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git submodule sync"
    ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git submodule sync"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git submodule init"
    ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git submodule init"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git submodule update"
    ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git submodule update"
    echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git stash pop"
    ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; git stash pop"
  fi

  COMPOSER_CMD="/usr/bin/composer"
  if [[ "$BRANCH" == "master" ]]; then
    if [[ "$TYPE" == "typo3" ]]; then
      ENVIRONMENT=Development
    fi
      PHP_DIR=/usr/bin
      PHP_CMD=php7.2
  else
    ENVIRONMENT=$BRANCH
    if [[ "$BRANCH" == "integration" ]]; then
      if [[ "$TYPE" == "typo3" ]]; then
        ENVIRONMENT=Development/Integration
      fi
    fi
    if [[ "$BRANCH" == "relaunch" ]]; then
      if [[ "$TYPE" == "typo3" ]]; then
        ENVIRONMENT=Development/Relaunch
      fi
    fi
    if [[ "$BRANCH" == "live" ]]; then
      if [[ "$TYPE" == "typo3" ]]; then
        ENVIRONMENT=Production
      fi
      PHP_DIR=$7
      PHP_CMD=$8
    else
      PHP_DIR=/usr/bin
      PHP_CMD=php7.2
    fi
  fi
  
  ${COMPOSER_CMD} config gitlab-token.gitlab.com ${GITLAB_COMPOSER_CONFIG_TOKEN}

  [[ "$TYPE" == "typo3" ]] && echo "Perform TYPO3 Deployment"

  if [[ "$BRANCH" == "live" ]]; then
    if [[ "$TYPE" == "typo3" ]]; then
      echo TODO TYPO3 Steps
      echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; $PHP_DIR/$PHP_CMD $COMPOSER_CMD install --no-dev --prefer-dist"
      echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; TYPO3_CONTEXT=$ENVIRONMENT $PHP_DIR/$PHP_CMD Packages/Libraries/bin/typo3cms install:fixfolderstructure"
      echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; TYPO3_CONTEXT=$ENVIRONMENT $PHP_DIR/$PHP_CMD Packages/Libraries/bin/typo3cms install:generatepackagestates"
    fi
  else
    if [[ "$TYPE" == "typo3" ]]; then
      echo TODO TYPO3 Steps
      echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; $PHP_DIR/$PHP_CMD $COMPOSER_CMD update --no-dev --prefer-dist"
      ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; $PHP_DIR/$PHP_CMD $COMPOSER_CMD update --no-dev --prefer-dist"
      echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; TYPO3_CONTEXT=$ENVIRONMENT $PHP_DIR/$PHP_CMD Packages/Libraries/bin/typo3cms install:fixfolderstructure"
      ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; TYPO3_CONTEXT=$ENVIRONMENT $PHP_DIR/$PHP_CMD Packages/Libraries/bin/typo3cms install:fixfolderstructure"
      echo ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; TYPO3_CONTEXT=$ENVIRONMENT $PHP_DIR/$PHP_CMD Packages/Libraries/bin/typo3cms install:generatepackagestates"
      ssh -o StrictHostKeyChecking=no -p22 $USER@$DOMAIN "cd $TARGETPATH ; TYPO3_CONTEXT=$ENVIRONMENT $PHP_DIR/$PHP_CMD Packages/Libraries/bin/typo3cms install:generatepackagestates"
    fi
  fi
else
  echo "Target-Domain: $DOMAIN not found"
  exit 1
fi
