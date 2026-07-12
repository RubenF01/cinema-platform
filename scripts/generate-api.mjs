import { rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = resolve(root, "apps/api");
const clientDir = resolve(root, "packages/api-client");
const generatedDir = resolve(clientDir, "src/generated");

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

rmSync(generatedDir, { recursive: true, force: true });
run("python3", ["-m", "uv", "run", "python", "../../scripts/export-openapi.py"], apiDir);
run("yarn", ["openapi-ts", "-i", "openapi.json", "-o", "src/generated", "-c", "@hey-api/client-fetch"], clientDir);
