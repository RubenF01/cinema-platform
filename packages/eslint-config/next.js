import { FlatCompat } from "@eslint/eslintrc";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import reactConfig from "./react.js";

const compat = new FlatCompat({
  baseDirectory: process.cwd()
});

export default [...reactConfig, ...compat.config(nextVitals)];
