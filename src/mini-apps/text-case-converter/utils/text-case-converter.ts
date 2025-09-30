import { SupportedTextCase } from "./constants";

export function transformTextCase(
  input: string,
  mode: SupportedTextCase,
  turnOnAnalyzeTextCase?: boolean,
) {
  if (turnOnAnalyzeTextCase) {
    const analyzeTextCase = detectTextCase(input);
    switch (analyzeTextCase) {
      case "LowerCase":
        return lowerCaseTo(input, mode);
      case "UpperCase":
        return upperCaseTo(input, mode);
      case "TitleCase":
        return titleCaseTo(input, mode);
      case "CamelCase":
        return camelCaseTo(input, mode);
      case "PascalCase":
        return pascalCaseTo(input, mode);
      case "SnakeCase":
        return snakeCaseTo(input, mode);
      case "KebabCase":
        return kebabCaseTo(input, mode);
      case "ConstantCase":
        return constantCaseTo(input, mode);
      case "DotCase":
        return dotCaseTo(input, mode);
      case "PathCase":
        return pathCaseTo(input, mode);
    }
  }

  switch (mode) {
    case "LowerCase":
      return toLowerCase(input);
    case "UpperCase":
      return toUpperCase(input);
    case "TitleCase":
      return toTitleCase(input);
    case "CamelCase":
      return toCamelCase(input);
    case "PascalCase":
      return toPascalCase(input);
    case "SnakeCase":
      return toSnakeCase(input);
    case "KebabCase":
      return toKebabCase(input);
    case "ConstantCase":
      return toConstantCase(input);
    case "DotCase":
      return toDotCase(input);
    case "PathCase":
      return toPathCase(input);
  }
}

export function detectTextCase(input: string): SupportedTextCase | "Unknown" {
  if (/^[a-z]+(\/[a-z0-9\s.,!?'"()-]+)+$/.test(input))
    return SupportedTextCase.PathCase;

  if (/^[a-z]+(-[a-z0-9\s.,!?'"()-]+)+$/.test(input))
    return SupportedTextCase.KebabCase;

  if (/^[a-z]+(\.[a-z0-9\s.,!?'"()-]+)+$/.test(input))
    return SupportedTextCase.DotCase;

  if (/^[a-z0-9\s.,!?'"()-]+$/.test(input)) return SupportedTextCase.LowerCase;

  if (/^[A-Z0-9\s.,!?'"()-]+$/.test(input)) return SupportedTextCase.UpperCase;

  if (/^[a-z]+([A-Z][a-z0-9\s.,!?'"()-]*)+$/.test(input))
    return SupportedTextCase.CamelCase;

  if (/^(?:[A-Z][a-z0-9]*)+$/.test(input)) return SupportedTextCase.PascalCase;

  if (/^(?:[A-Z][a-z0-9]*)(?:\s[A-Z][a-z0-9]*)+$/.test(input))
    return SupportedTextCase.TitleCase;

  if (/^[a-z]+(_[a-z0-9]+)+$/.test(input)) return SupportedTextCase.SnakeCase;

  if (/^[A-Z]+(_[A-Z0-9\s.,!?'"()-]+)+$/.test(input))
    return SupportedTextCase.ConstantCase;

  return "Unknown";
}

export function toLowerCase(input: string) {
  return input.toLowerCase();
}

export function toUpperCase(input: string) {
  return input.toUpperCase();
}

export function toTitleCase(input: string) {
  return input?.replace(/\w+/gi, (c) => c[0]?.toUpperCase() + c.slice(1));
}

export function toCamelCase(input: string) {
  return input
    .split("\n")
    .map((line) =>
      line
        .split(/\s+/)
        .map((word, i) =>
          i === 0
            ? word.charAt(0).toLowerCase() + word.slice(1)
            : word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join(""),
    )
    .join("\n");
}

export function toPascalCase(input: string) {
  return input
    .split("\n")
    .map((line) =>
      line
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(""),
    )
    .join("\n");
}

export function toSnakeCase(input: string) {
  return input?.replace(/[^\S\n]/gi, "_");
}

export function toKebabCase(input: string) {
  return input?.replace(/[^\S\n]/gi, "-");
}

export function toConstantCase(input: string) {
  return input?.replace(/[^\S\n]/gi, "_")?.toUpperCase();
}

export function toDotCase(input: string) {
  return input?.replace(/[^\S\n]/gi, ".")?.toLowerCase();
}

export function toPathCase(input: string) {
  return input?.replace(/[^\S\n]/gi, "/")?.toLowerCase();
}

// lower case to other case:
export function lowerCaseTo(input: string, mode: SupportedTextCase) {
  switch (mode) {
    case "LowerCase":
      return input;
    case "UpperCase":
      return lowerCaseToUpperCase(input);
    case "TitleCase":
      return lowerCaseToTitleCase(input);
    case "CamelCase":
      return lowerCaseToCamelCase(input);
    case "PascalCase":
      return lowerCaseToPascalCase(input);
    case "SnakeCase":
      return lowerCaseToSnakeCase(input);
    case "KebabCase":
      return lowerCaseToKebabCase(input);
    case "ConstantCase":
      return lowerCaseToConstantCase(input);
    case "DotCase":
      return lowerCaseToDotCase(input);
    case "PathCase":
      return lowerCaseToPathCase(input);

    default:
      return input;
  }
}

export function lowerCaseToUpperCase(input: string) {
  return input.toUpperCase();
}

export function lowerCaseToTitleCase(input: string) {
  return input?.replace(/\w+/gi, (c) => c[0]?.toUpperCase() + c.slice(1));
}

export function lowerCaseToCamelCase(input: string) {
  return toCamelCase(input.toLowerCase());
}

export function lowerCaseToPascalCase(input: string) {
  return toPascalCase(input.toLowerCase());
}

export function lowerCaseToSnakeCase(input: string) {
  return toSnakeCase(input.toLowerCase());
}

export function lowerCaseToKebabCase(input: string) {
  return toKebabCase(input.toLowerCase());
}

export function lowerCaseToConstantCase(input: string) {
  return toConstantCase(input);
}

export function lowerCaseToDotCase(input: string) {
  return toDotCase(input.toLowerCase());
}

export function lowerCaseToPathCase(input: string) {
  return toPathCase(input);
}

// upper case to other case
export function upperCaseTo(input: string, mode: SupportedTextCase) {
  switch (mode) {
    case "LowerCase":
      return upperCaseToLowerCase(input);
    case "UpperCase":
      return input;
    case "TitleCase":
      return upperCaseToTitleCase(input);
    case "CamelCase":
      return upperCaseToCamelCase(input);
    case "PascalCase":
      return upperCaseToPascalCase(input);
    case "SnakeCase":
      return upperCaseToSnakeCase(input);
    case "KebabCase":
      return upperCaseToKebabCase(input);
    case "ConstantCase":
      return upperCaseToConstantCase(input);
    case "DotCase":
      return upperCaseToDotCase(input);
    case "PathCase":
      return upperCaseToPathCase(input);

    default:
      return input;
  }
}

export function upperCaseToLowerCase(input: string) {
  return toLowerCase(input);
}

export function upperCaseToTitleCase(input: string) {
  return toTitleCase(input.toLowerCase());
}

export function upperCaseToCamelCase(input: string) {
  return toCamelCase(input.toLowerCase());
}

export function upperCaseToPascalCase(input: string) {
  return toPascalCase(input.toLowerCase());
}

export function upperCaseToSnakeCase(input: string) {
  return toSnakeCase(input.toLowerCase());
}

export function upperCaseToKebabCase(input: string) {
  return toKebabCase(input.toLowerCase());
}

export function upperCaseToConstantCase(input: string) {
  return toConstantCase(input.toLowerCase());
}

export function upperCaseToDotCase(input: string) {
  return toDotCase(input);
}

export function upperCaseToPathCase(input: string) {
  return toPathCase(input);
}

// title case to other case
export function titleCaseTo(input: string, mode: SupportedTextCase) {
  switch (mode) {
    case "LowerCase":
      return titleCaseToLowerCase(input);
    case "UpperCase":
      return titleCaseToUpperCase(input);
    case "TitleCase":
      return input;
    case "CamelCase":
      return titleCaseToCamelCase(input);
    case "PascalCase":
      return titleCaseToPascalCase(input);
    case "SnakeCase":
      return titleCaseToSnakeCase(input);
    case "KebabCase":
      return titleCaseToKebabCase(input);
    case "ConstantCase":
      return titleCaseToConstantCase(input);
    case "DotCase":
      return titleCaseToDotCase(input);
    case "PathCase":
      return titleCaseToPathCase(input);

    default:
      return input;
  }
}

export function titleCaseToLowerCase(input: string) {
  return toLowerCase(input);
}

export function titleCaseToUpperCase(input: string) {
  return toUpperCase(input);
}

export function titleCaseToCamelCase(input: string) {
  return toCamelCase(input);
}

export function titleCaseToPascalCase(input: string) {
  return toPascalCase(input.toLowerCase());
}

export function titleCaseToSnakeCase(input: string) {
  return toSnakeCase(input.toLowerCase());
}

export function titleCaseToKebabCase(input: string) {
  return toKebabCase(input.toLowerCase());
}

export function titleCaseToConstantCase(input: string) {
  return toConstantCase(input);
}

export function titleCaseToDotCase(input: string) {
  return toDotCase(input.toLowerCase());
}

export function titleCaseToPathCase(input: string) {
  return toPathCase(input.toLowerCase());
}

// camel case to other case
export function camelCaseTo(input: string, mode: SupportedTextCase) {
  switch (mode) {
    case "LowerCase":
      return camelCaseToLowerCase(input);
    case "UpperCase":
      return camelCaseToUpperCase(input);
    case "TitleCase":
      return camelCaseToTitleCase(input);
    case "CamelCase":
      return input;
    case "PascalCase":
      return camelCaseToPascalCase(input);
    case "SnakeCase":
      return camelCaseToSnakeCase(input);
    case "KebabCase":
      return camelCaseToKebabCase(input);
    case "ConstantCase":
      return camelCaseToConstantCase(input);
    case "DotCase":
      return camelCaseToDotCase(input);
    case "PathCase":
      return camelCaseToPathCase(input);

    default:
      return input;
  }
}

export function camelCaseToLowerCase(input: string) {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // insert space before capitals
    .toLowerCase();
}

export function camelCaseToUpperCase(input: string) {
  const lowerCase = camelCaseToLowerCase(input);
  return toUpperCase(lowerCase);
}

export function camelCaseToTitleCase(input: string) {
  const lowerCase = camelCaseToLowerCase(input);
  return toTitleCase(lowerCase);
}

export function camelCaseToPascalCase(input: string) {
  const lowerCase = camelCaseToLowerCase(input);
  return toPascalCase(lowerCase);
}

export function camelCaseToSnakeCase(input: string) {
  const lowerCase = camelCaseToLowerCase(input);
  return toSnakeCase(lowerCase);
}

export function camelCaseToKebabCase(input: string) {
  const lowerCase = camelCaseToLowerCase(input);
  return toKebabCase(lowerCase);
}

export function camelCaseToConstantCase(input: string) {
  const lowerCase = camelCaseToLowerCase(input);
  return toConstantCase(lowerCase);
}

export function camelCaseToDotCase(input: string) {
  const lowerCase = camelCaseToLowerCase(input);
  return toDotCase(lowerCase);
}

export function camelCaseToPathCase(input: string) {
  const lowerCase = camelCaseToLowerCase(input);
  return toPathCase(lowerCase);
}

// pascal case to other case
export function pascalCaseTo(input: string, mode: SupportedTextCase) {
  switch (mode) {
    case "LowerCase":
      return pascalCaseToLowerCase(input);
    case "UpperCase":
      return pascalCaseToUpperCase(input);
    case "TitleCase":
      return pascalCaseToTitleCase(input);
    case "CamelCase":
      return pascalCaseToCamelCase(input);
    case "PascalCase":
      return input;
    case "SnakeCase":
      return pascalCaseToSnakeCase(input);
    case "KebabCase":
      return pascalCaseToKebabCase(input);
    case "ConstantCase":
      return pascalCaseToConstantCase(input);
    case "DotCase":
      return pascalCaseToDotCase(input);
    case "PathCase":
      return pascalCaseToPathCase(input);

    default:
      return input;
  }
}

export function pascalCaseToLowerCase(input: string) {
  return input
    .split("\n")
    .map((line) =>
      line.replace(/([A-Z])/g, (match, p1, offset) =>
        offset > 0 ? " " + p1 : p1,
      ),
    )
    .join("\n")
    .toLowerCase();
}

export function pascalCaseToUpperCase(input: string) {
  const lowerCase = pascalCaseToLowerCase(input);
  return toUpperCase(lowerCase);
}

export function pascalCaseToTitleCase(input: string) {
  const lowerCase = pascalCaseToLowerCase(input);
  return toTitleCase(lowerCase);
}

export function pascalCaseToCamelCase(input: string) {
  const lowerCase = pascalCaseToLowerCase(input);
  return toCamelCase(lowerCase);
}

export function pascalCaseToSnakeCase(input: string) {
  const lowerCase = pascalCaseToLowerCase(input);
  return toSnakeCase(lowerCase);
}

export function pascalCaseToKebabCase(input: string) {
  const lowerCase = pascalCaseToLowerCase(input);
  return toKebabCase(lowerCase);
}

export function pascalCaseToConstantCase(input: string) {
  const lowerCase = pascalCaseToLowerCase(input);
  return toConstantCase(lowerCase);
}

export function pascalCaseToDotCase(input: string) {
  const lowerCase = pascalCaseToLowerCase(input);
  return toDotCase(lowerCase);
}

export function pascalCaseToPathCase(input: string) {
  const lowerCase = pascalCaseToLowerCase(input);
  return toPathCase(lowerCase);
}

// snake case to other case
export function snakeCaseTo(input: string, mode: SupportedTextCase) {
  switch (mode) {
    case "LowerCase":
      return snakeCaseToLowerCase(input);
    case "UpperCase":
      return snakeCaseToUpperCase(input);
    case "TitleCase":
      return snakeCaseToTitleCase(input);
    case "CamelCase":
      return snakeCaseToCamelCase(input);
    case "PascalCase":
      return snakeCaseToPascalCase(input);
    case "SnakeCase":
      return input;
    case "KebabCase":
      return snakeCaseToKebabCase(input);
    case "ConstantCase":
      return snakeCaseToConstantCase(input);
    case "DotCase":
      return snakeCaseToDotCase(input);
    case "PathCase":
      return snakeCaseToPathCase(input);

    default:
      return input;
  }
}

export function snakeCaseToLowerCase(input: string) {
  return input.replace("_", " ");
}

export function snakeCaseToUpperCase(input: string) {
  const lowerCase = snakeCaseToLowerCase(input);
  return toUpperCase(lowerCase);
}

export function snakeCaseToTitleCase(input: string) {
  const lowerCase = snakeCaseToLowerCase(input);
  return toTitleCase(lowerCase);
}

export function snakeCaseToCamelCase(input: string) {
  const lowerCase = snakeCaseToLowerCase(input);
  return toCamelCase(lowerCase);
}

export function snakeCaseToPascalCase(input: string) {
  const lowerCase = snakeCaseToLowerCase(input);
  return toPascalCase(lowerCase);
}

export function snakeCaseToKebabCase(input: string) {
  const lowerCase = snakeCaseToLowerCase(input);
  return toKebabCase(lowerCase);
}

export function snakeCaseToConstantCase(input: string) {
  const lowerCase = snakeCaseToLowerCase(input);
  return toConstantCase(lowerCase);
}

export function snakeCaseToDotCase(input: string) {
  const lowerCase = snakeCaseToLowerCase(input);
  return toDotCase(lowerCase);
}

export function snakeCaseToPathCase(input: string) {
  const lowerCase = snakeCaseToLowerCase(input);
  return toPathCase(lowerCase);
}

// kebab case to other case
export function kebabCaseTo(input: string, mode: SupportedTextCase) {
  switch (mode) {
    case "LowerCase":
      return kebabCaseToLowerCase(input);
    case "UpperCase":
      return kebabCaseToUpperCase(input);
    case "TitleCase":
      return kebabCaseToTitleCase(input);
    case "CamelCase":
      return kebabCaseToCamelCase(input);
    case "PascalCase":
      return kebabCaseToPascalCase(input);
    case "SnakeCase":
      return kebabCaseToSnakeCase(input);
    case "KebabCase":
      return input;
    case "ConstantCase":
      return kebabCaseToConstantCase(input);
    case "DotCase":
      return kebabCaseToDotCase(input);
    case "PathCase":
      return kebabCaseToPathCase(input);

    default:
      return input;
  }
}

export function kebabCaseToLowerCase(input: string) {
  return input.replace(/-/gi, " ");
}

export function kebabCaseToUpperCase(input: string) {
  const lowerCase = kebabCaseToLowerCase(input);
  return toUpperCase(lowerCase);
}

export function kebabCaseToTitleCase(input: string) {
  const lowerCase = kebabCaseToLowerCase(input);
  return toTitleCase(lowerCase);
}

export function kebabCaseToCamelCase(input: string) {
  const lowerCase = kebabCaseToLowerCase(input);
  return toCamelCase(lowerCase);
}

export function kebabCaseToPascalCase(input: string) {
  const lowerCase = kebabCaseToLowerCase(input);
  return toPascalCase(lowerCase);
}

export function kebabCaseToSnakeCase(input: string) {
  const lowerCase = kebabCaseToLowerCase(input);
  return toSnakeCase(lowerCase);
}

export function kebabCaseToConstantCase(input: string) {
  const lowerCase = kebabCaseToLowerCase(input);
  return toConstantCase(lowerCase);
}

export function kebabCaseToDotCase(input: string) {
  const lowerCase = kebabCaseToLowerCase(input);
  return toDotCase(lowerCase);
}

export function kebabCaseToPathCase(input: string) {
  const lowerCase = kebabCaseToLowerCase(input);
  return toPathCase(lowerCase);
}

// constant case to other case
export function constantCaseTo(input: string, mode: SupportedTextCase) {
  switch (mode) {
    case "LowerCase":
      return constantCaseToLowerCase(input);
    case "UpperCase":
      return constantCaseToUpperCase(input);
    case "TitleCase":
      return constantCaseToTitleCase(input);
    case "CamelCase":
      return constantCaseToCamelCase(input);
    case "PascalCase":
      return constantCaseToPascalCase(input);
    case "SnakeCase":
      return constantCaseToSnakeCase(input);
    case "KebabCase":
      return constantCaseToKebabCase(input);
    case "ConstantCase":
      return input;
    case "DotCase":
      return constantCaseToDotCase(input);
    case "PathCase":
      return constantCaseToPathCase(input);
    default:
      return input;
  }
}

export function constantCaseToLowerCase(input: string) {
  return input?.replace(/_/gi, " ").toLowerCase();
}

export function constantCaseToUpperCase(input: string) {
  const lowerCase = constantCaseToLowerCase(input);
  return toUpperCase(lowerCase);
}

export function constantCaseToTitleCase(input: string) {
  const lowerCase = constantCaseToLowerCase(input);
  return toTitleCase(lowerCase);
}

export function constantCaseToCamelCase(input: string) {
  const lowerCase = constantCaseToLowerCase(input);
  return toCamelCase(lowerCase);
}

export function constantCaseToPascalCase(input: string) {
  const lowerCase = constantCaseToLowerCase(input);
  return toPascalCase(lowerCase);
}
export function constantCaseToSnakeCase(input: string) {
  const lowerCase = constantCaseToLowerCase(input);
  return toSnakeCase(lowerCase);
}
export function constantCaseToKebabCase(input: string) {
  const lowerCase = constantCaseToLowerCase(input);
  return toKebabCase(lowerCase);
}

export function constantCaseToDotCase(input: string) {
  const lowerCase = constantCaseToLowerCase(input);
  return toDotCase(lowerCase);
}

export function constantCaseToPathCase(input: string) {
  const lowerCase = constantCaseToLowerCase(input);
  return toPathCase(lowerCase);
}

// dot case to other case
export function dotCaseTo(input: string, mode: SupportedTextCase) {
  switch (mode) {
    case "LowerCase":
      return dotCaseToLowerCase(input);
    case "UpperCase":
      return dotCaseToUpperCase(input);
    case "TitleCase":
      return dotCaseToTitleCase(input);
    case "CamelCase":
      return dotCaseToCamelCase(input);
    case "PascalCase":
      return dotCaseToPascalCase(input);
    case "SnakeCase":
      return dotCaseToSnakeCase(input);
    case "KebabCase":
      return dotCaseToKebabCase(input);
    case "ConstantCase":
      return dotCaseToConstantCase(input);
    case "DotCase":
      return input;
    case "PathCase":
      return dotCaseToPathCase(input);
    default:
      return input;
  }
}

export function dotCaseToLowerCase(input: string) {
  return input?.replace(/\./gi, " ")?.toLowerCase();
}

export function dotCaseToUpperCase(input: string) {
  const lowerCase = dotCaseToLowerCase(input);
  return toUpperCase(lowerCase);
}

export function dotCaseToTitleCase(input: string) {
  const lowerCase = dotCaseToLowerCase(input);
  return toTitleCase(lowerCase);
}

export function dotCaseToCamelCase(input: string) {
  const lowerCase = dotCaseToLowerCase(input);
  return toCamelCase(lowerCase);
}

export function dotCaseToPascalCase(input: string) {
  const lowerCase = dotCaseToLowerCase(input);
  return toPascalCase(lowerCase);
}

export function dotCaseToSnakeCase(input: string) {
  const lowerCase = dotCaseToLowerCase(input);
  return toSnakeCase(lowerCase);
}

export function dotCaseToKebabCase(input: string) {
  const lowerCase = dotCaseToLowerCase(input);
  return toKebabCase(lowerCase);
}

export function dotCaseToConstantCase(input: string) {
  const lowerCase = dotCaseToLowerCase(input);
  return toConstantCase(lowerCase);
}

export function dotCaseToPathCase(input: string) {
  const lowerCase = dotCaseToLowerCase(input);
  return toPathCase(lowerCase);
}

// path case to other case
export function pathCaseTo(input: string, mode: SupportedTextCase) {
  switch (mode) {
    case "LowerCase":
      return pathCaseToLowerCase(input);
    case "UpperCase":
      return pathCaseToUpperCase(input);
    case "TitleCase":
      return pathCaseToTitleCase(input);
    case "CamelCase":
      return pathCaseToCamelCase(input);
    case "PascalCase":
      return pathCaseToPascalCase(input);
    case "SnakeCase":
      return pathCaseToSnakeCase(input);
    case "KebabCase":
      return pathCaseToKebabCase(input);
    case "ConstantCase":
      return pathCaseToConstantCase(input);
    case "DotCase":
      return pathCaseToDotCase(input);
    case "PathCase":
      return input;
    default:
      return input;
  }
}

export function pathCaseToLowerCase(input: string) {
  return input?.replace(/\//gi, " ")?.toLowerCase();
}

export function pathCaseToUpperCase(input: string) {
  const lowerCase = pathCaseToLowerCase(input);
  return toUpperCase(lowerCase);
}

export function pathCaseToTitleCase(input: string) {
  const lowerCase = pathCaseToLowerCase(input);
  return toTitleCase(lowerCase);
}

export function pathCaseToCamelCase(input: string) {
  const lowerCase = pathCaseToLowerCase(input);
  return toCamelCase(lowerCase);
}

export function pathCaseToPascalCase(input: string) {
  const lowerCase = pathCaseToLowerCase(input);
  return toPascalCase(lowerCase);
}

export function pathCaseToSnakeCase(input: string) {
  const lowerCase = pathCaseToLowerCase(input);
  return toSnakeCase(lowerCase);
}

export function pathCaseToKebabCase(input: string) {
  const lowerCase = pathCaseToLowerCase(input);
  return toKebabCase(lowerCase);
}

export function pathCaseToConstantCase(input: string) {
  const lowerCase = pathCaseToLowerCase(input);
  return toConstantCase(lowerCase);
}

export function pathCaseToDotCase(input: string) {
  const lowerCase = pathCaseToLowerCase(input);
  return toDotCase(lowerCase);
}
