#!/usr/bin/env zx

// 确保脚本抛出遇到的错误
await $`set -e`

// # 生成静态文件
try {
  await $`pnpm run docs:build`
  console.log(chalk.green('build success'))
} catch (e) {
  console.log(chalk.red('build error'))
  console.log(e);
}


// # 进入生成的文件夹
cd('./docs/.vitepress/dist')

// # 如果是发布到自定义域名
// # echo 'www.example.com' > CNAME

await Promise.all([
  $`git init`,
  $`git add -A`,
  $`git commit -m 'deploy'`,
]).then(async () => {
  await $`git push -f git@github.com:klwfwdk/klwfwdk.github.io.git master`
})

// # 如果发布到 https://<USERNAME>.github.io

// # 如果发布到 https://<USERNAME>.github.io/<REPO>
// # git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

// cd -