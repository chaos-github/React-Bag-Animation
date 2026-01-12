/**
 * Webpack 插件：自动复制 @mentley/mysterybox-animation 的资源文件到 public 目录
 * 
 * 使用方法：
 * 在 webpack.config.js 中：
 * 
 * const { BagAnimationAssetsPlugin } = require('@mentley/mysterybox-animation/webpack-plugin');
 * 
 * module.exports = {
 *   plugins: [
 *     new BagAnimationAssetsPlugin(),
 *     // ... 其他插件
 *   ]
 * }
 */

const { copyFileSync, mkdirSync, readdirSync, existsSync } = require('fs');
const { join, resolve } = require('path');

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

class BagAnimationAssetsPlugin {
  constructor(options = {}) {
    this.options = {
      publicDir: options.publicDir || 'public',
      packageName: options.packageName || '@mentley/mysterybox-animation'
    };
  }

  apply(compiler) {
    compiler.hooks.beforeRun.tapAsync('BagAnimationAssetsPlugin', (compilation, callback) => {
      try {
        const packagePath = resolve(process.cwd(), 'node_modules', this.options.packageName, 'dist', 'assets');
        const targetPath = resolve(process.cwd(), this.options.publicDir, 'assets');
        
        if (existsSync(packagePath)) {
          copyDir(packagePath, targetPath);
          console.log(`✅ [bag-animation-assets] Assets copied to ${this.options.publicDir}/assets`);
        } else {
          console.warn(`⚠️  [bag-animation-assets] Package assets not found at ${packagePath}`);
        }
      } catch (error) {
        console.error(`❌ [bag-animation-assets] Error copying assets:`, error);
      }
      callback();
    });
  }
}

module.exports = { BagAnimationAssetsPlugin };

