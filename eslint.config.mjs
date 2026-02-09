import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("next/typescript"),
  {
    files: ["src/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: ["react", "next", "next/router", "next/navigation"],
          patterns: ["@/infrastructure/**", "@/app/**"],
        },
      ],
    },
  },
  {
    files: ["src/app/**/*.tsx", "src/app/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@/infrastructure/**"],
        },
      ],
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message:
            "Data fetching should be handled in the Infrastructure layer via Repositories, not directly in the UI.",
        },
      ],
    },
  },
  {
    files: ["src/application/usecases/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@/infrastructure/**", "@/app/**"],
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "class",
          format: ["PascalCase"],
          suffix: ["UseCase"],
        },
      ],
    },
  },
  {
    files: ["src/infrastructure/repositories/**/*.ts"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: ["class", "interface"],
          format: ["PascalCase"],
          suffix: ["Repository"],
        },
      ],
    },
  },
  {
    files: ["src/domain/policies/**/*.ts"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "class",
          format: ["PascalCase"],
          suffix: ["Policy"],
        },
      ],
    },
  },
  {
    files: ["src/domain/entities/**/*.ts"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "class",
          format: ["PascalCase"],
          suffix: ["Entity"],
        },
      ],
    },
  },
];

export default eslintConfig;
