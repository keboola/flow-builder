import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

import fs from "fs";
import rimraf from "rimraf";
import path from "path";

/**
 * @param {string[] | undefined} targets
 * @returns {import("rollup").Plugin }
 */
const clean = (targets = []) => ({
  name: "clean",
  buildStart(_options) {
    for (const target of targets) {
      const targetPath = path.normalize(target);
      fs.existsSync(targetPath) && rimraf.sync(targetPath);
    }
  }
});

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
    clean(["dist"]),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    copy({
      targets: [{ src: "src/Graph.css", dest: "dist" }]
    }),
    terser({
      format: {
        comments: false
      }
    })
  ]
};
