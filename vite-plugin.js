/**
 * Vite 插件：自动复制 @mentley/mysterybox-animation 的资源文件到 public 目录
 * 
 * 使用方法：
 * 在 vite.config.js/ts 中：
 * 
 * import { bagAnimationAssets } from '@mentley/mysterybox-animation/vite-plugin';
 * 
 * export default {
 *   plugins: [
 *     bagAnimationAssets(),
 *     // ... 其他插件
 *   ]
 * }
 */

import { copyFileSync, mkdirSync, readdirSync, existsSync, statSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function copyDir(src, dest) {
  if (!existsSync(src)) return;
  
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
  
  const entries = readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

export function bagAnimationAssets(options = {}) {
  const {
    publicDir = 'public',
    packageName = '@mentley/mysterybox-animation'
  } = options;

  return {
    name: 'mysterybox-animation-assets',
    apply: 'serve', // 只在开发服务器时应用
    buildStart() {
      try {
        // 查找 node_modules 中的包
        const packagePath = resolve(process.cwd(), 'node_modules', packageName, 'dist', 'assets');
        const targetPath = resolve(process.cwd(), publicDir, 'assets');
        
        if (existsSync(packagePath)) {
          copyDir(packagePath, targetPath);
          console.log(`✅ [bag-animation-assets] Assets copied to ${publicDir}/assets`);
        } else {
          console.warn(`⚠️  [bag-animation-assets] Package assets not found at ${packagePath}`);
        }
      } catch (error) {
        console.error(`❌ [bag-animation-assets] Error copying assets:`, error);
      }
    },
    buildEnd() {
      // 构建时也复制资源
      try {
        const packagePath = resolve(process.cwd(), 'node_modules', packageName, 'dist', 'assets');
        const targetPath = resolve(process.cwd(), publicDir, 'assets');
        
        if (existsSync(packagePath)) {
          copyDir(packagePath, targetPath);
          console.log(`✅ [bag-animation-assets] Assets copied to ${publicDir}/assets`);
        }
      } catch (error) {
        console.error(`❌ [bag-animation-assets] Error copying assets:`, error);
      }
    }
  };
}

