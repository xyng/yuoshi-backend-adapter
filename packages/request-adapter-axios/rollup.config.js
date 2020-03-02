import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import typescript from "rollup-plugin-typescript2"

import pkg from "./package.json"

export default [
	{
		input: "src/main.ts",
		external: [
			"axios",
		],
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
		plugins: [
			resolve(),
			typescript({
				sourcemap: true,
			}),
			commonjs({
				extensions: [".js", ".ts"],
				sourcemap: true
			}),
			json(),
		],
	},
]
