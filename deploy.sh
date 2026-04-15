#!/usr/bin/env sh

# 发生错误时终止
set -e

# 清理旧的构建
rm -rf dist

# 构建
npm run build

# 进入构建文件夹
cd dist

# 如果你要部署到自定义域名
# echo 'www.example.com' > CNAME

git init
git checkout -b main
git add -A
git commit -m 'deploy'

# 部署到 gh-pages 分支
git push -f git@github.com:sun409377708/SkyPianoWeb.git main:gh-pages

cd -
