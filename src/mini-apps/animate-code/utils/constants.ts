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
a
`;

const slide1 = `
b
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

export const defaultDummySlides = [
  slide0,
  slide1,
  slide2,
  slide3,
  slide4,
  slide5,
  slide6,
];

const d = [slide0, slide1];

export const defaultSlides = d.map((v) => ({ id: v4(), data: atom(v) }));

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

export const supportedHighlightJsThemes = [
  { label: "1C Light", value: "1c-light" },
  { label: "A11y Dark", value: "a11y-dark" },
  { label: "A11y Light", value: "a11y-light" },
  { label: "Agate", value: "agate" },
  { label: "An Old Hope", value: "an-old-hope" },
  { label: "Android Studio", value: "androidstudio" },
  { label: "Arduino Light", value: "arduino-light" },
  { label: "Arta", value: "arta" },
  { label: "Ascetic", value: "ascetic" },
  { label: "Atom One Dark Reasonable", value: "atom-one-dark-reasonable" },
  { label: "Atom One Dark", value: "atom-one-dark" },
  { label: "Atom One Light", value: "atom-one-light" },
  { label: "Brown Paper", value: "brown-paper" },
  { label: "CodePen Embed", value: "codepen-embed" },
  { label: "Color Brewer", value: "color-brewer" },
  { label: "Cybertopia Cherry", value: "cybertopia-cherry" },
  { label: "Cybertopia Dimmer", value: "cybertopia-dimmer" },
  { label: "Cybertopia Icecap", value: "cybertopia-icecap" },
  { label: "Cybertopia Saturated", value: "cybertopia-saturated" },
  { label: "Dark", value: "dark" },
  { label: "Default", value: "default" },
  { label: "Devibeans", value: "devibeans" },
  { label: "Docco", value: "docco" },
  { label: "Far", value: "far" },
  { label: "Felipec", value: "felipec" },
  { label: "Foundation", value: "foundation" },
  { label: "GitHub Dark Dimmed", value: "github-dark-dimmed" },
  { label: "GitHub Dark", value: "github-dark" },
  { label: "GitHub", value: "github" },
  { label: "GML", value: "gml" },
  { label: "Google Code", value: "googlecode" },
  { label: "Gradient Dark", value: "gradient-dark" },
  { label: "Gradient Light", value: "gradient-light" },
  { label: "Grayscale", value: "grayscale" },
  { label: "Hybrid", value: "hybrid" },
  { label: "IDEA", value: "idea" },
  { label: "IntelliJ Light", value: "intellij-light" },
  { label: "IR Black", value: "ir-black" },
  { label: "ISBL Editor Dark", value: "isbl-editor-dark" },
  { label: "ISBL Editor Light", value: "isbl-editor-light" },
  { label: "Kimbie Dark", value: "kimbie-dark" },
  { label: "Kimbie Light", value: "kimbie-light" },
  { label: "Lightfair", value: "lightfair" },
  { label: "Lioshi", value: "lioshi" },
  { label: "Magula", value: "magula" },
  { label: "Mono Blue", value: "mono-blue" },
  { label: "Monokai Sublime", value: "monokai-sublime" },
  { label: "Monokai", value: "monokai" },
  { label: "Night Owl", value: "night-owl" },
  { label: "NNFX Dark", value: "nnfx-dark" },
  { label: "NNFX Light", value: "nnfx-light" },
  { label: "Nord", value: "nord" },
  { label: "Obsidian", value: "obsidian" },
  { label: "Panda Syntax Dark", value: "panda-syntax-dark" },
  { label: "Panda Syntax Light", value: "panda-syntax-light" },
  { label: "Paraiso Dark", value: "paraiso-dark" },
  { label: "Paraiso Light", value: "paraiso-light" },
  { label: "Pojoaque", value: "pojoaque" },
  { label: "PureBasic", value: "purebasic" },
  { label: "QtCreator Dark", value: "qtcreator-dark" },
  { label: "QtCreator Light", value: "qtcreator-light" },
  { label: "Rainbow", value: "rainbow" },
  { label: "Rose Pine Dawn", value: "rose-pine-dawn" },
  { label: "Rose Pine Moon", value: "rose-pine-moon" },
  { label: "Rose Pine", value: "rose-pine" },
  { label: "RouterOS", value: "routeros" },
  { label: "School Book", value: "school-book" },
  { label: "Shades of Purple", value: "shades-of-purple" },
  { label: "Srcery", value: "srcery" },
  { label: "Stack Overflow Dark", value: "stackoverflow-dark" },
  { label: "Stack Overflow Light", value: "stackoverflow-light" },
  { label: "Sunburst", value: "sunburst" },
  { label: "Tokyo Night Dark", value: "tokyo-night-dark" },
  { label: "Tokyo Night Light", value: "tokyo-night-light" },
  { label: "Tomorrow Night Blue", value: "tomorrow-night-blue" },
  { label: "Tomorrow Night Bright", value: "tomorrow-night-bright" },
  { label: "VS", value: "vs" },
  { label: "VS2015", value: "vs2015" },
  { label: "Xcode", value: "xcode" },
  { label: "XT256", value: "xt256" },
];

export const codeEditorConfig = {
  fontSize: 12,
};

export const predefinedEditorFontSize = [
  10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96,
];
