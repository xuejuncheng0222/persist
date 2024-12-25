import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import type { RollupOptions } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

const config: RollupOptions[] = [
  {
    input: 'src/main.ts', // 入口文件
    output: {
      file: 'dist/index.js',
      format: 'es',
    },
    plugins: [
      resolve(), // 告诉 Rollup 如何查找外部模块
      commonjs(), // 将 CommonJS 转换为 ES6 模块供 Rollup 使用
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
  },
  {
    input: 'src/main.ts',
    output: {
      file: 'dist/index.d.ts', // 类型声明文件输出路径
      format: 'es',
    },
    plugins: [
      dts(), // 生成 .d.ts 文件
    ],
  },
]

export default config
