import type { Config } from "@jest/types";
import nextJest from "next/jest";

export const config: Config.InitialOptions = {
  bail: 1,
  testRegex: ["\\.unit\\.spec\\.tsx?$"],
  testEnvironment: "jest-environment-jsdom",
  verbose: true,
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^@common/(.*)$": "<rootDir>/src/common/$1",
    "^@modules/(.*)$": "<rootDir>/src/modules/$1"
    // '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
  }
};

export default nextJest()(config);
