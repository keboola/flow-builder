import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import copy from "@rollup-extras/plugin-copy";
import clean from "@rollup-extras/plugin-clean";
import terser from "@rollup/plugin-terser";

import pkg from "./package.json";

export default {
  input: "src/index.tsx",
  external: Object.keys(pkg.peerDependencies),
  output: [
    { file: pkg.main, format: "cjs", sourcemap: true },
    { file: pkg.module, format: "es", sourcemap: true },
    {
      file: pkg.browser,
      format: "umd",
      sourcemap: true,
      name: "Flow",
      globals: {
        react: "React",
        "react-dom": "ReactDOM"
      }
    }
  ],
  plugins: [
    clean("dist"),
    nodeResolve(),
    commonjs(),
    typescript(),
    copy({ targets: [{ src: "src/Graph.css", dest: "dist" }] }),
    terser()
  ]
};
