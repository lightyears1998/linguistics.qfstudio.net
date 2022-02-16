# 开发者文档

## 开发环境

请先确保安装了JavaScript运行环境[NodeJS](https://nodejs.org/zh-cn/)和包管理器[yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable)。

```sh
git clone https://github.com/dapao111/Dapp-KingEngine.git
cd Dapp-KingEngine
yarn install # 安装开发所需依赖
```

## 端口转发

开发中常用的端口转发如下：

``` sh
ssh -fNT -L 5432:127.0.0.1:5432 drugs.qfstudio.net
ssh -fNT -L 6379:127.0.0.1:6379 drugs.qfstudio.net
```

## Git 协作

- Git log 使用中文。

## 编程环境推荐设置

### Visual Studio Code 推荐设置

在本项目的开发过程中使用了以下 VS Code 插件：

| 插件 ID | 功能 | 配置文件 |
| --- | --- | --- |
| dbaeumer.vscode-eslint | ESLint 插件 | eslintrc.yml |
| streetSideSoftware.code-spell-checker | 拼写检查 | cspell.json |

推荐的 VS Code 设置如下：

``` json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 常见问题

### Apollo TypeGraph Playground 不能使用 Cookie 保持登录状态？

Apollo TypeGraph Playground 在使用 Cookies 时，需要设置 `"request.credentials": "include"`。

### 数据库备份

两种方式：

- 使用 `pg_dump`
- 使用 PgAdmin（进行 Backup，推荐选择 Plain 格式）
