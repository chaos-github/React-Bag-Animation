#!/usr/bin/env node

/**
 * 安装脚本：自动复制资源文件到项目的 public 目录
 * 
 * 使用方法：
 * 1. 在 package.json 中添加 postinstall 脚本：
 *    "scripts": {
 *      "postinstall": "node node_modules/@mentley/mysterybox-animation/scripts/copy-assets.js"
 *    }
 * 
 * 2. 或者手动运行：
 *    node node_modules/@mentley/mysterybox-animation/scripts/copy-assets.js
 */

const { copyFileSync, mkdirSync, readdirSync, existsSync } = require('fs');
const { join, resolve } = require('path');

function copyDir(src, dest) {
  if (!existsSync(src)) {
    console.warn(`⚠️  Source directory not found: ${src}`);
    return;
  }
  
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

function main() {
  const packageName = '@mentley/mysterybox-animation';
  const publicDir = process.argv[2] || 'public';
  
  // 查找包的位置 - 嘗試多種路徑
  let packagePath = null;
  const possiblePaths = [
    resolve(__dirname, '..', 'dist', 'assets'),
    resolve(__dirname, '..', '..', '..', 'node_modules', packageName, 'dist', 'assets'),
  ];
  
  // 如果當前目錄有 node_modules，也嘗試從那裡找
  const cwd = process.cwd();
  if (existsSync(join(cwd, 'node_modules', packageName))) {
    possiblePaths.push(resolve(cwd, 'node_modules', packageName, 'dist', 'assets'));
  }
  
  // 從 package.json 的位置找
  try {
    const packageJsonPath = require.resolve(`${packageName}/package.json`);
    const packageRoot = resolve(packageJsonPath, '..');
    possiblePaths.push(resolve(packageRoot, 'dist', 'assets'));
  } catch (e) {
    // 忽略錯誤
  }
  
  // 找到第一個存在的路徑
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      packagePath = path;
      break;
    }
  }
  
  const targetPath = resolve(cwd, publicDir, 'assets');
  
  console.log(`📦 Copying assets from ${packageName}...`);
  if (packagePath) {
    console.log(`   Source: ${packagePath}`);
    console.log(`   Target: ${targetPath}`);
    
    copyDir(packagePath, targetPath);
    console.log(`✅ Assets copied successfully to ${publicDir}/assets`);
  } else {
    console.warn(`⚠️  Warning: Package assets not found.`);
    console.warn(`   Searched paths:`);
    possiblePaths.forEach(path => {
      console.warn(`     - ${path} ${existsSync(path) ? '✓' : '✗'}`);
    });
    console.warn(`   This is not a critical error. The package will still work, but you may need to:`);
    console.warn(`   1. Manually copy assets from the package if needed`);
    console.warn(`   2. Or use custom asset paths in your component configuration`);
    console.warn(`   Installation will continue...`);
    // 不退出，讓安裝繼續
  }
}

main();

