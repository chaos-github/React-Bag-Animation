/**
 * 获取打包后的资源路径
 * 这些资源会被打包到 dist/assets 目录中
 * 
 * 使用方式：
 * 1. 如果使用默认资源，可以通过 getAssetPath 获取路径
 * 2. 或者直接传入自定义路径覆盖默认值
 */
export function getAssetPath(relativePath: string): string {
  // 在开发环境中，尝试从 public 目录读取
  // 在生产环境中，资源应该在 dist/assets 中
  // 用户需要配置他们的构建工具来提供这些资源
  
  // 移除开头的斜杠（如果有）
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  
  // 返回相对于包根目录的路径
  // 用户需要配置他们的项目来从 node_modules/@mentley/mysterybox-animation/dist/assets 提供这些资源
  return `/assets/${cleanPath}`;
}

/**
 * 默认的动画帧路径
 */
export const defaultAnimationFrames = [
  "/assets/bag/blind_box_spin.png",
  "/assets/bag/blind_box_unopen.png",
  "/assets/bag/blind_box_tear_off.png",
  "/assets/bag/blind_box_open.png",
];

/**
 * 默认的图片路径
 */
export const defaultImagePath = "/assets/bag/bag.png";

