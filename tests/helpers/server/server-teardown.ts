import { ChildProcess } from "child_process";

async function teardown() {
  console.log("\n[Start] Global teardown");
  (global.LOCAL_SERVER as ChildProcess).kill();
  console.log("[Done] Global teardown");
}

export default teardown;
