# 使用说明

## 在新项目中安装

### 步骤 1: 安装包

```bash
npm install git@github.com:Mentley/mysterybox-animation.git
```

### 步骤 2: 确保安装了 peer dependencies

这个包需要 React 和 React-DOM，确保你的项目已安装：

```bash
npm install react@^18.3.1 react-dom@^18.3.1
```

## 引入方式

### ✅ 方式 1: 命名导出（推荐，这是正确的方式）

```typescript
import { BagAnimation } from "@mentley/mysterybox-animation";
```

### 方式 2: 如果方式 1 报错，检查以下几点：

1. **确保包已正确安装**：
   ```bash
   # 删除 node_modules 和 lock 文件
   rm -rf node_modules package-lock.json
   # 重新安装
   npm install
   ```

2. **检查 TypeScript 配置**（如果使用 TypeScript）：
   确保 `tsconfig.json` 中有：
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "node",
       "esModuleInterop": true,
       "allowSyntheticDefaultImports": true
     }
   }
   ```

3. **如果使用 Vite/Webpack**，可能需要重启开发服务器

### 方式 3: 使用 require (CommonJS)

```javascript
import { BagAnimation } from "@mentley/mysterybox-animation";
```

## 📦 图片资源说明

**组件已包含默认图片资源！** 图片会被打包到 `dist/assets` 目录中，默认路径为 `/assets/bag/...`。

### 🚀 自动复制资源（推荐）

我们提供了多种方式自动复制资源，**无需手动操作**：

#### 方式 1: 使用 Vite 插件（推荐，适用于 Vite 项目）

在 `vite.config.js/ts` 中添加插件：

```js
import { defineConfig } from 'vite';
import { bagAnimationAssets } from '@mentley/mysterybox-animation/vite-plugin';

export default defineConfig({
  plugins: [
    bagAnimationAssets(), // 自动复制资源到 public/assets
    // ... 其他插件
  ]
});
```

插件会在开发服务器启动和构建时自动将资源复制到 `public/assets` 目录。

#### 方式 2: 使用 Webpack 插件（适用于 Webpack 项目）

在 `webpack.config.js` 中添加插件：

```js
const { BagAnimationAssetsPlugin } = require('@mentley/mysterybox-animation/webpack-plugin');

module.exports = {
  plugins: [
    new BagAnimationAssetsPlugin(), // 自动复制资源到 public/assets
    // ... 其他插件
  ]
};
```

#### 方式 3: 使用 postinstall 脚本（适用于所有项目）

在项目的 `package.json` 中添加：

```json
{
  "scripts": {
    "postinstall": "node node_modules/@mentley/mysterybox-animation/scripts/copy-assets.js"
  }
}
```

这样每次运行 `npm install` 后，资源会自动复制到 `public/assets` 目录。

#### 方式 4: 手动运行脚本（一次性）

如果不想使用 postinstall，可以手动运行：

```bash
node node_modules/@mentley/mysterybox-animation/scripts/copy-assets.js
```

### 使用默认资源

配置好自动复制后，直接使用组件，不需要传 props：

```tsx
<BagAnimation
  doneFunction={handleDone}
  // 不传 frames 和 defaultImage，会使用默认的打包资源
/>
```

### 方式 2: 使用自定义图片路径（覆盖默认）

```tsx
import React, { useState } from 'react';
import { BagAnimation } from '@mentley/mysterybox-animation';

function App() {

  const handleDone = () => {
    console.log('Animation completed!');
    setIsAnimating(false);
  };

  // 使用自定义图片路径（会覆盖默认的打包资源）
  const animationFrames = [
    '/my-custom-assets/blind_box_spin.png',      // 第1帧：旋转动画
    '/my-custom-assets/blind_box_unopen.png',    // 第2帧：未打开
    '/my-custom-assets/blind_box_tear_off.png',  // 第3帧：撕开动画（可拖拽）
    '/my-custom-assets/blind_box_open.png',      // 第4帧：打开后
  ];

  return (
    <div>
      <button onClick={() => setIsAnimating(true)}>
        开始动画
      </button>
      
      <BagAnimation
        doneFunction={handleDone}
        frames={animationFrames}
        defaultImage="/my-custom-assets/bag.png"
        defaultImageAlt="Mystery Box"
        swipeHintText="滑动打开"
      />
    </div>
  );
}

export default App;
```

### 方式 3: 混合使用（部分使用默认，部分自定义）

你也可以只替换部分图片：

```tsx
import { BagAnimation, defaultAnimationFrames } from '@mentley/mysterybox-animation';

// 使用默认的前3帧，只替换最后一帧
const customFrames = [
  ...defaultAnimationFrames.slice(0, 3), // 使用默认的前3個動畫
  '/my-custom-assets/blind_box_open.png', // 自定义最后1個動畫
];

<BagAnimation
  doneFunction={handleDone}
  frames={customFrames}
/>
```

## ⚠️ 重要：Tailwind CSS 依赖

**这个组件使用了 Tailwind CSS 类名**，你需要：

1. **安装 Tailwind CSS**（如果还没有）：
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **配置 `tailwind.config.js`**：
   ```js
   module.exports = {
     content: [
       "./src/**/*.{js,jsx,ts,tsx}",
       "./node_modules/@mentley/mysterybox-animation/**/*.{js,jsx,ts,tsx}", // 添加这行
     ],
     // ... 其他配置
   }
   ```

3. **或者**：如果你不想使用 Tailwind，可以修改组件源码，将 `className` 改为内联 `style`。

## 完整使用示例

### 示例 1: 使用默认打包的图片

```tsx
import React, { useState } from 'react';
import { BagAnimation } from '@mentley/mysterybox-animation';

function App() {
  const handleDone = () => {
    console.log('Animation completed!');
    setIsAnimating(false);
  };

  return (
    <div className="p-8">
      <button 
        onClick={() => setIsAnimating(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        开始动画
      </button>
      
      <div className="mt-8">
        {/* 使用默认打包的图片，不需要传 frames 和 defaultImage */}
        {/* 动画会在画面中央全屏显示，背景会有黑色模糊遮罩 */}
        <BagAnimation
          doneFunction={handleDone}
        />
      </div>
    </div>
  );
}

export default App;
```

### 示例 2: 使用自定义图片

```tsx
import React, { useState } from 'react';
import { BagAnimation } from '@mentley/mysterybox-animation';

function App() {
  const handleDone = () => {
    console.log('Animation completed!');
    setIsAnimating(false);
  };

  // 自定义图片路径
  const frames = [
    '/my-assets/blind_box_spin.png',
    '/my-assets/blind_box_unopen.png',
    '/my-assets/blind_box_tear_off.png',
    '/my-assets/blind_box_open.png',
  ];

  return (
    <div className="p-8">
      <button 
        onClick={() => setIsAnimating(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        开始动画
      </button>
      
      <div className="mt-8">
        <BagAnimation
          doneFunction={handleDone}
          frames={frames}
          defaultImage="/my-assets/bag.png"
          defaultImageAlt="Mystery Box"
          swipeHintText="滑动打开"
        />
      </div>
    </div>
  );
}

export default App;
```

## Props 说明

| Prop | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `doneFunction` | `() => void` | ✅ | - | 动画完成时的回调函数 |
| `frames` | `string[]` | ❌ | `["/assets/bag/..."]` | 动画帧图片路径数组（4张），不传则使用打包的默认图片 |
| `defaultImage` | `string` | ❌ | `"/assets/bag.png"` | 默认显示的图片，不传则使用打包的默认图片 |
| `defaultImageAlt` | `string` | ❌ | `"Weedza Mystery Box"` | 默认图片的 alt 文本 |
| `swipeHintText` | `string` | ❌ | `"Swipe to open"` | 滑动提示文本 |
| `boxOpeningText` | `string` | ❌ | `"Box opening..."` | 盒子打开时的文本 |
| `clickHintText` | `string` | ❌ | `"Click to open"` | 点击提示文本 |
| `skipAnimationText` | `string` | ❌ | `"Skip"` | 跳过动画文本 |
| `showMask` | `boolean` | ❌ | `true` | 是否显示遮罩层（黑色模糊背景），动画会在画面中央全屏显示 |
| `maskOpacity` | `number` | ❌ | `0.7` | 遮罩层的透明度（0-1），值越大背景越暗 |
| `maskBlur` | `number` | ❌ | `8` | 遮罩层的模糊程度（px），值越大背景越模糊 |

## 遮罩层功能

组件默认会在动画播放时显示一个全屏的遮罩层，具有以下特性：

- **全屏显示**：动画会在画面中央全屏显示
- **黑色背景**：遮罩层提供黑色半透明背景（默认透明度 0.7）
- **模糊效果**：背景会有模糊效果（默认 8px），让用户专注于动画
- **可自定义**：可以通过 props 控制遮罩的显示、透明度和模糊程度

### 遮罩层使用示例

```tsx
// 使用默认遮罩（推荐）
<BagAnimation
  doneFunction={handleDone}
/>

// 自定义遮罩样式
<BagAnimation
  doneFunction={handleDone}
  showMask={true}        // 显示遮罩
  maskOpacity={0.8}      // 更暗的背景
  maskBlur={12}          // 更强的模糊效果
/>

// 不显示遮罩（动画会在原位置显示）
<BagAnimation
  doneFunction={handleDone}
  showMask={false}
/>
```

## 注意事项

1. **图片资源**：
   - 组件已包含默认图片资源（打包在 `dist/assets` 中）
   - 默认路径为 `/assets/bag/...`
   - **推荐使用提供的插件或脚本自动复制资源**，无需手动操作
   - 或者通过 props 传入自定义路径来覆盖默认图片
2. **资源自动复制**：
   - Vite 项目：使用 `bagAnimationAssets()` 插件
   - Webpack 项目：使用 `BagAnimationAssetsPlugin`
   - 其他项目：使用 postinstall 脚本或手动运行复制脚本
3. **遮罩层**：
   - 默认启用，动画会在画面中央全屏显示
   - 使用 `backdrop-filter: blur()` 实现模糊效果
   - 如果浏览器不支持 `backdrop-filter`，会回退到纯色背景
4. **Tailwind CSS**：组件使用了 Tailwind 类名，需要安装并配置 Tailwind
3. **React 版本**：确保你的项目已安装 React 和 React-DOM（版本 ^19.2.3）
4. **TypeScript**：如果使用 TypeScript，确保已安装 `@types/react` 和 `@types/react-dom`
5. **图片格式**：动画帧需要使用 APNG 格式的图片
6. **如果遇到导入错误**：
   - 删除 `node_modules` 和 `package-lock.json`，然后重新安装
   - 检查你的 TypeScript 配置
   - 确保包已正确发布到 npm

