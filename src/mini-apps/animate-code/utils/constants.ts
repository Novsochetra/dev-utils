import { v4 } from "uuid";
import { atom } from "jotai";

export const APP_NAME = "Animate Code";

export const APP_BASE_PATH = "/animate-code";

export const APP_ID = v4();

export const Mode = {
  Preview: 0,
  Edit: 1,
} as const;

export type Mode = (typeof Mode)[keyof typeof Mode];

export const PreviewState = {
  IDLE: 0,
  PLAY: 1,
  PAUSE: 2,
  RESUME: 3,
  FINISH: 4,
} as const;

export type PreviewState = (typeof PreviewState)[keyof typeof PreviewState];

export const PreviewResizeDirection = {
  UP: 1,
  DOWN: -1,
} as const;

export type PreviewResizeDirection =
  (typeof PreviewResizeDirection)[keyof typeof PreviewResizeDirection];

export const interval: { previewAnimationInterval: NodeJS.Timeout | null } = {
  previewAnimationInterval: null,
};

export const AnimationInterval = 3000;

// Example slides
const slide0 = `
// Create a simple class
`;

const slide1 = `
// Create a simple class
class Person {
}
`;

const slide2 = `
// Create a simple class
class Person {
  constructor() { }
}
`;

const slide3 = `
// Create a simple class
class Person {
  constructor(name) {
    this.name = name;
  }
}
`;

const slide4 = `
// Create a simple class
class Person {
  constructor(name) { /* ... */ }
}

// Create an instance
const person = new Person("Alice");
`;

const slide5 = `
// Create a simple class
class Person { /* ... */ }

// Create an instance
const person = new Person("Alice");

`;

const slide6 = `
// Create a simple class
class Person { /* ... */ }

// Create an instance
const person = new Person("Alice");
console.log("person: ", person)
`;

const d = [slide0, slide1, slide2, slide3, slide4, slide5, slide6];

export const defaultSlides = d.map((v, i) => ({ id: v4(), data: atom(v) }));

// highlightLanguages.ts
export const supportedHighlightJsLanguages = [
  { label: "Bash / Shell (sh, zsh)", value: "bash", aliases: ["sh", "zsh"] },
  { label: "C# (cs)", value: "csharp", aliases: ["cs"] },
  {
    label: "C++ (cxx, hpp, cc, hh)",
    value: "cpp",
    aliases: ["cxx", "hpp", "cc", "hh"],
  },
  { label: "CSS", value: "css" },
  { label: "Go (golang)", value: "go", aliases: ["golang"] },
  {
    label: "HTML / XML (html, xhtml, rss, atom, svg)",
    value: "xml",
    aliases: ["html", "xhtml", "rss", "atom", "svg"],
  },
  { label: "Java (jsp)", value: "java", aliases: ["jsp"] },
  {
    label: "JavaScript (js, jsx)",
    value: "javascript",
    aliases: ["js", "jsx"],
  },
  { label: "JSON (json5, jsonc)", value: "json", aliases: ["json5", "jsonc"] },
  {
    label: "Markdown (md, mkdown, mkd)",
    value: "markdown",
    aliases: ["md", "mkdown", "mkd"],
  },
  { label: "PHP", value: "php" },
  { label: "Python (py, gyp)", value: "python", aliases: ["py", "gyp"] },
  { label: "Rust (rs)", value: "rust", aliases: ["rs"] },
  { label: "SCSS", value: "scss" },
  { label: "SQL", value: "sql" },
  {
    label: "TypeScript (ts, tsx)",
    value: "typescript",
    aliases: ["ts", "tsx"],
  },
  { label: "YAML (yml)", value: "yaml", aliases: ["yml"] },
];
