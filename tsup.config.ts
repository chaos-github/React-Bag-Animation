import { defineConfig } from "tsup";
import { copyFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join } from "path";

// 复制目录的辅助函数
function copyDir(src: string, dest: string) {
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

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["react", "react-dom"],
  tsconfig: "./tsconfig.json",
  onSuccess: async () => {
    // 复制 public/assets 到 dist/assets
    const publicAssetsPath = join(process.cwd(), "public", "assets");
    const distAssetsPath = join(process.cwd(), "dist", "assets");
    
    if (existsSync(publicAssetsPath)) {
      copyDir(publicAssetsPath, distAssetsPath);
      console.log("✅ Assets copied to dist/assets");
    } else {
      // 如果 public/assets 不存在，创建目录结构
      mkdirSync(distAssetsPath, { recursive: true });
      console.log("⚠️  public/assets not found, created empty dist/assets directory");
    }
  },
});
