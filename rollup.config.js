import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
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
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    postcss(),
    terser({
      format: {
        comments: false
      }
    })
  ]
};
