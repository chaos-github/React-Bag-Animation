# 快速开始

## 1. 安装

```bash
npm install @mentley/mysterybox-animation
```

## 2. 配置自动复制资源

### 选项 A: Vite 项目（推荐）

在 `vite.config.js/ts` 中：

```js
import { bagAnimationAssets } from '@mentley/mysterybox-animation/vite-plugin';

export default {
  plugins: [
    bagAnimationAssets(),
  ]
}
```

### 选项 B: Webpack 项目

在 `webpack.config.js` 中：

```js
const { BagAnimationAssetsPlugin } = require('@mentley/mysterybox-animation/webpack-plugin');

module.exports = {
  plugins: [
    new BagAnimationAssetsPlugin(),
  ]
}
```

### 选项 C: 使用 postinstall 脚本

在 `package.json` 中：

```json
{
  "scripts": {
    "postinstall": "node node_modules/@mentley/mysterybox-animation/scripts/copy-assets.js"
  }
}
```

## 3. 使用组件

```tsx
import { BagAnimation } from '@mentley/mysterybox-animation';
import { useState } from 'react';

function App() {
  return (
    <BagAnimation
      doneFunction={() => console.log('Done!')}
    />
  );
}
```

完成！资源会自动复制，无需手动操作。

