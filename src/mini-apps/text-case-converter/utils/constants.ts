export const SupportedTextCase = {
  LowerCase: "LowerCase",
  UpperCase: "UpperCase",
  TitleCase: "TitleCase",
  CamelCase: "CamelCase",
  PascalCase: "PascalCase",
  SnakeCase: "SnakeCase",
  KebabCase: "KebabCase",
  ConstantCase: "ConstantCase",
  DotCase: "DotCase",
  PathCase: "PathCase",
} as const;

export const SupportedTextCaseLabel = {
  LowerCase: "lower case",
  UpperCase: "UPPER CASE",
  TitleCase: "Title Case",
  CamelCase: "camelCase",
  PascalCase: "PascalCase",
  SnakeCase: "snake_case",
  KebabCase: "kebab-case",
  ConstantCase: "CONSTANT_CASE",
  DotCase: "dot.case",
  PathCase: "path/case",
} as const;

export type SupportedTextCase =
  (typeof SupportedTextCase)[keyof typeof SupportedTextCase];
