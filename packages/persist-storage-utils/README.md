# Persist Storage Utils

`persist-storage-utils` 是一个用于简化数据持久化存储的工具库，支持多种存储方式。

## 安装

使用 npm 或 yarn 安装：

```bash
npm install persist-storage-utils
```

```bash
yarn add persist-storage-utils
```


## 使用示例

### 1. 导入库

首先，你需要在你的项目中导入这个库：

```ts
import { createStorage } from 'persist-storage-utils'
```

### 2. 创建存储实例

然后，你可以使用 `createStorage` 函数来创建一个存储实例：

```ts
import { createStorage } from 'persist-storage-utils'

const storage = createStorage({
  prefixKey: 'my-app',
  storage: localStorage,
})

storage.set('test', 'test')
storage.get('test')
storage.remove('test')
storage.clear()
```

## 贡献

欢迎提交问题和拉取请求！

## 许可证

MIT 许可证