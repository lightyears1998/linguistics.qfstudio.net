#!/usr/bin/zsh

print_pwd () {
    echo "Entering $PWD:"
}

PROJECT_PATH=${0:a:h}/..
PM2_PROJECT_NAME=linguistics

if [ -z "$PM2_PROJECT_NAME" ];
  then echo "$PM2_PROJECT_NAME is null" && exit 1;
  else echo "PM2_PROJECT_NAME=$PM2_PROJECT_NAME";
fi

setopt verbose

git reset --hard
git pull --rebase

(cd $PROJECT_PATH/backend && print_pwd && yarn install && yarn build && pm2 restart $PM2_PROJECT_NAME-backend)
(cd $PROJECT_PATH/frontend && print_pwd && yarn install && yarn build && pm2 restart $PM2_PROJECT_NAME-frontend)
