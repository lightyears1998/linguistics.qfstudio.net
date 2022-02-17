#!/usr/bin/zsh

print_pwd () {
    echo "Entering $PWD:"
}

PM2_PROJECT_NAME=linguistics

if [ -z "$PM2_PROJECT_NAME" ];
  then echo "$PM2_PROJECT_NAME is null" && exit 1;
  else echo "PM2_PROJECT_NAME=$PM2_PROJECT_NAME";
fi

setopt verbose

git reset --hard
git pull --rebase

(cd ../backend && print_pwd && yarn install && yarn build && pm2 restart $PM2_PROJECT_NAME-backend)
(cd ../frontend && print_pwd && yarn install && yarn build && pm2 restart $PM2_PROJECT_NAME-frontend)
