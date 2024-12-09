import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import type { RollupOptions } from 'rollup';
import typescript from '@rollup/plugin-typescript';

const config: RollupOptions = {
  input: "src/main.ts",// 入口文件
  output: {
    file: "dist/bundle.js",
    format: "es",
  },
  // external: ["dayjs"],
  plugins: [
    resolve(),// 告诉 Rollup 如何查找外部模块
    commonjs(),// 将 CommonJS 转换为 ES6 模块供 Rollup 使用
    typescript(),
  ],
};

export default config;