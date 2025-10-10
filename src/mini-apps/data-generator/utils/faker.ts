import { faker } from "@faker-js/faker";

export const getObjectMethods = (obj: Record<string, unknown>) => {
  return Object.keys(obj)?.filter((key) => typeof obj[key] === "function");
};

export const SupportedFakerModules = {
  airline: faker.airline,
  animal: faker.animal,
  book: faker.book,
  color: faker.color,
  commerce: faker.commerce,
  company: faker.company,
  database: faker.database,
  datatype: faker.datatype, // info: need to decide seem no good use case
  date: faker.date,
  word: faker.word,

  helpers: faker.helpers,
  location: faker.location,
  number: faker.number,

  string: faker.string,
  // "rawDefinitions",
  // "definitions",
  finance: faker.finance,
  food: faker.food,
  git: faker.git,
  hacker: faker.hacker,
  image: faker.image,
  internet: faker.internet,
  lorem: faker.lorem,
  music: faker.music,
  person: faker.person,
  phone: faker.phone,
  science: faker.science,
  system: faker.system,
  vehicle: faker.vehicle,
};

// known faker internals we don’t want to expose
const INTERNAL_KEYS = new Set([
  "faker",
  "_faker",
  "_definition",
  "definitions",
  "fake",
  "helpers",
  "seed",
  "seedValue",
  "mersenne",
]);

// Recursively build faker paths dynamically
function getFakerPaths(
  obj: any,
  prefix = "",
  visited = new WeakSet(),
): string[] {
  const results: string[] = [];

  if (visited.has(obj)) return results;
  visited.add(obj);

  for (const key of Object.keys(obj)) {
    if (key.startsWith("_") || INTERNAL_KEYS.has(key)) continue;

    let value: any;
    try {
      value = obj[key];
    } catch {
      continue; // skip getters that throw
    }

    if (typeof value === "function") {
      // call function safely to check if it returns object or primitive
      let result;
      try {
        result = value();
      } catch {
        result = undefined; // skip if function requires parameters
      }

      if (result && typeof result === "object" && !Array.isArray(result)) {
        // function returns an object → expose its fields
        for (const field of Object.keys(result)) {
          results.push(`${prefix}${prefix ? "." : ""}${key}().${field}`);
        }
      } else {
        // function returns primitive → just expose
        results.push(`${prefix}${prefix ? "." : ""}${key}()`);
      }
    } else if (typeof value === "object" && value !== null) {
      // recurse deeper
      results.push(
        ...getFakerPaths(value, `${prefix}${prefix ? "." : ""}${key}`, visited),
      );
    } else {
      // primitive field → expose as-is
      results.push(`${prefix}${prefix ? "." : ""}${key}`);
    }
  }

  return results;
}

const ALLOWED_MODULES = Object.keys(SupportedFakerModules);

// Flatten all paths
export const availableFakerPaths = Object.entries(
  SupportedFakerModules,
).flatMap(([name, module]) => getFakerPaths(module, name));

// MARK: the function call date.between(), date.betweens(), string.fromCharacters() is require params
// we need to provide the way for user easy for calling it
export function callFakerPath(expression: string) {
  let trimmed = expression.trim();

  if (!availableFakerPaths.includes(trimmed)) {
    return trimmed;
  }

  trimmed = `faker.${trimmed}`;
  const match = trimmed.match(/^faker\.([a-zA-Z0-9_]+)/);
  if (!match || !ALLOWED_MODULES.includes(match[1])) {
    throw new Error(`Module "${match?.[1] || "unknown"}" is not allowed.`);
  }

  // Safe-ish eval for dev tools
  return eval(trimmed); // still use eval, but input is validated
}
