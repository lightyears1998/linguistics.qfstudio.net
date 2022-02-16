#!/usr/bin/zsh

print_pwd () {
    echo "Entering $PWD:"
}

PM2_NAME_PREFIX=`git branch --show-current`

if [ -z "$PM2_NAME_PREFIX" ];
  then echo "$PM2_NAME_PREFIX is null" && exit 1;
  else echo "PM2_NAME_PREFIX=$PM2_NAME_PREFIX";
fi

setopt verbose

git reset --hard
git pull --rebase

(cd ../backend && print_pwd && yarn install && yarn build && pm2 restart $PM2_NAME_PREFIX-backend)
(cd ../frontend && print_pwd && yarn install && yarn build && pm2 restart $PM2_NAME_PREFIX-frontend)
