import cp, { ChildProcess } from "child_process";
import wait from "wait-on";
import path from "path";
import fs from "fs";

const stdout = path.resolve(__dirname, "stdout.txt");
const stderr = path.resolve(__dirname, "stderr.txt");

async function setup() {
  console.log("\n[Start] Global setup");
  global.LOCAL_SERVER = cp.exec("yarn dev");

  fs.writeFileSync(stdout, "");
  fs.writeFileSync(stderr, "");

  (global.LOCAL_SERVER as ChildProcess).stdout.on("data", (data) =>
    fs.appendFileSync(stdout, data)
  );

  (global.LOCAL_SERVER as ChildProcess).stderr.on("data", (data) =>
    fs.appendFileSync(stderr, data)
  );

  await wait({ resources: ["http://localhost:3000"] });
  console.log("[Done] Global setup");
}

export default setup;
