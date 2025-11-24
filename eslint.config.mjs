import { dirname } from "path";
import { fileURLToPath } from "url";
// Minimal flat ESLint config to avoid circular-config issues with FlatCompat.
// This temporarily disables extending `eslint-config-next`. If you want Next's
// rules, consider switching to a legacy `.eslintrc.cjs` or investigate plugin
// compatibility (or try `compat.extends("next/core-web-vitals")` again).

export default [
    {
        ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
    },
];
