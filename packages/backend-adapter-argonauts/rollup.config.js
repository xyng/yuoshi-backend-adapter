import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "rollup-plugin-typescript2"

import pkg from "./package.json"

export default [
	{
		input: "src/main.ts",
		output: [
			{
				file: pkg.main,
				format: "cjs",
				sourcemap: true,
			},
			{
				file: pkg.module,
				format: "es",
				sourcemap: true,
			},
		],
		external: [
			"@xyng/yuoshi-backend-adapter",
			"querystring",
			"crypto",
		],
		plugins: [
			typescript({
				sourcemap: true,
			}),
			commonjs({
				extensions: [".js", ".ts"],
				sourcemap: true,
			}),
			resolve(),
		],
	},
]
