# 图片资源说明

## 📁 资源目录结构

将你的图片资源放在以下位置：

```
public/
  assets/
    main/
      bag/
        blind_box_spin.png      # 第1帧：旋转动画
        blind_box_unopen.png    # 第2帧：未打开
        blind_box_tear_off.png  # 第3帧：撕开动画（可拖拽）
        blind_box_open.png      # 第4帧：打开后
        bag.png                 # 默认显示的图片
```

## 🔨 构建时自动复制

运行 `npm run build` 时，`public/assets` 目录中的资源会自动复制到 `dist/assets` 中。

## 📦 打包后的结构

构建完成后，`dist` 目录结构如下：

```
dist/
  assets/
    main/
      bag/
        [你的图片文件]
  index.js
  index.mjs
  index.d.ts
  ...
```

## ✅ 验证资源

构建后检查 `dist/assets` 目录，确认图片已正确复制。

## 🎯 使用方式

### 使用默认资源（推荐）

如果你将图片放在 `public/assets/main/bag/` 中，构建后可以直接使用：

```tsx
<BagAnimation
  doneFunction={handleDone}
  // 不传 frames 和 defaultImage，会使用默认路径
/>
```

### 使用自定义资源

如果你想使用不同的图片路径，可以通过 props 传入：

```tsx
<BagAnimation
  doneFunction={handleDone}
  frames={[
    '/my-custom-path/frame1.png',
    '/my-custom-path/frame2.png',
    '/my-custom-path/frame3.png',
    '/my-custom-path/frame4.png',
  ]}
  defaultImage="/my-custom-path/default.png"
/>
```

