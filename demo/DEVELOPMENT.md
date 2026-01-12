# 开发环境设置

## 安装依赖

首先安装开发依赖：

```bash
npm install
```

如果遇到权限问题，可以尝试：

```bash
npm install --legacy-peer-deps
```

## 启动开发服务器

```bash
npm run demo
```

这会在 `http://localhost:3000` 启动开发服务器，自动打开浏览器。

## 功能

- ✅ 实时预览组件效果
- ✅ 热重载（修改代码自动刷新）
- ✅ 可以直接测试所有功能
- ✅ 查看遮罩层效果
- ✅ 测试动画播放

## 文件结构

```
demo/
  ├── index.html      # HTML 入口
  ├── main.tsx        # React 入口
  └── App.tsx         # 示例应用

src/
  ├── BagAnimation.tsx  # 组件源码
  └── index.ts          # 导出文件
```

## 注意事项

1. 确保 `public/assets` 目录中有图片资源
2. 如果修改了组件代码，开发服务器会自动重新编译
3. 可以在 `demo/App.tsx` 中修改示例来测试不同场景

