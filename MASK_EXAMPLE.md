# 遮罩层功能示例

## 功能说明

组件现在支持全屏遮罩层功能，当动画播放时：
- 动画会在画面中央全屏显示
- 背景会有黑色半透明遮罩
- 背景会有模糊效果，让用户专注于动画

## 基本使用

```tsx
import { BagAnimation } from '@mentley/mysterybox-animation';
import { useState } from 'react';

function App() {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <BagAnimation
      doneFunction={() => console.log('Done!')}
      // 默认 showMask={true}，会显示遮罩层
    />
  );
}
```

## 自定义遮罩样式

### 更暗的背景

```tsx
<BagAnimation
  doneFunction={handleDone}
  showMask={true}
  maskOpacity={0.9}  // 更暗（0-1，值越大越暗）
  maskBlur={12}      // 更强的模糊效果
/>
```

### 更亮的背景

```tsx
<BagAnimation
  doneFunction={handleDone}
  showMask={true}
  maskOpacity={0.5}  // 更亮
  maskBlur={4}       // 较弱的模糊
/>
```

### 不显示遮罩（在原位置显示动画）

```tsx
<BagAnimation
  doneFunction={handleDone}
  showMask={false}  // 不显示遮罩，动画在原位置显示
/>
```

## 完整示例

```tsx
import { BagAnimation } from '@mentley/mysterybox-animation';
import { useState } from 'react';

function App() {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDone = () => {
    console.log('Animation completed!');
    setIsAnimating(false);
  };

  return (
    <div>
      <button onClick={() => setIsAnimating(true)}>
        开始动画
      </button>
      
      {/* 动画会在画面中央全屏显示，背景有黑色模糊遮罩 */}
      <BagAnimation
        doneFunction={handleDone}
        showMask={true}      // 显示遮罩
        maskOpacity={0.7}    // 70% 透明度
        maskBlur={8}        // 8px 模糊
      />
    </div>
  );
}
```

## Props 说明

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `showMask` | `boolean` | `true` | 是否显示遮罩层 |
| `maskOpacity` | `number` | `0.7` | 遮罩透明度（0-1） |
| `maskBlur` | `number` | `8` | 模糊程度（px） |

## 技术细节

- 使用 `fixed` 定位实现全屏遮罩
- 使用 `backdrop-filter: blur()` 实现模糊效果
- 使用 `flexbox` 实现动画居中显示
- z-index 设置为 9998（遮罩）和 9999（动画内容），确保在最上层

