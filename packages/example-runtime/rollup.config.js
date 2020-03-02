import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import html from "@rollup/plugin-html"
import typescript from "rollup-plugin-typescript2"
import serve from "rollup-plugin-serve"
import livereload from "rollup-plugin-livereload"
import builtins from "rollup-plugin-node-builtins"

import pkg from "./package.json"

export default [
	{
		input: "src/main.ts",
		output: {
			dir: "dist",
			format: "umd",
		},
		plugins: [
			resolve({
				jsnext: true,
				preferBuiltins: true,
				browser: true,
			}),
			typescript({
				objectHashIgnoreUnknownHack: true
			}),
			commonjs({
				browser: true,
				extensions: [".js", ".ts"],
			}),
			builtins(),
			html(),
			serve('dist'),
			livereload()
		],
	},
]
