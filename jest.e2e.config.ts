import { config as unitConfig } from "./jest.unit.config";
import { Config } from "@jest/types";
import nextJest from "next/jest";

const config: Config.InitialOptions = {
  ...unitConfig,
  globalSetup: "./tests/helpers/server/server-setup.ts",
  globalTeardown: "./tests/helpers/server/server-teardown.ts",
  testRegex: ["\\.e2e\\.spec\\.ts$"],
  testEnvironment: "node",
  preset: "jest-playwright-preset"
};

export default nextJest()(config);
