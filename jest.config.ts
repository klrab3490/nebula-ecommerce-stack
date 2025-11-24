/** @jest-config-loader ts-node */
// or
/** @jest-config-loader esbuild-register */

import type { Config } from 'jest';

const config: Config = {
  verbose: true,
};

export default config;