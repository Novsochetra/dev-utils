import { v4 } from "uuid";
import { atom } from "jotai";
import { type ThemeNames } from "../screens/components/code-editor/extensions/themes";

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
const slide0 = `<!DOCTYPE html>
<html>
<head></head>
<body></body>
</html>
`;

const slide1 = `<!DOCTYPE html>
<html>
<head></head>
<body>
</body>
</html>
`;

const slide2 = `<!DOCTYPE html>
<html>
<body>
  <p>This is a paragraph.</p>
</body>
</html>
`;

const slide3 = `<!DOCTYPE html>
<html>
<body>
  <p class="">This is a paragraph.</p>
</body>
</html>
`;

const slide4 = `<!DOCTYPE html>
<html>
<body>
  <p class="container">This is a paragraph.</p>
</body>
</html>
`;

const slide5 = `<!DOCTYPE html>
<html>
<body>
  <p class="container">/* ... */</p>
</body>
</html>
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

export const defaultProjectId = v4();

const d = [slide0, slide1, slide2, slide3, slide4, slide5];

export const defaultSlides = d.map((v) => ({
  id: v4(),
  data: atom(v),
  preview: atom(false),
}));

// INFO: make code editor support languages
export const supportedHighlightJsLanguages = [
  // { label: "Bash / Shell (sh, zsh)", value: "bash", aliases: ["sh", "zsh"] },
  // { label: "C# (cs)", value: "csharp", aliases: ["cs"] },
  // {
  //   label: "C++ (cxx, hpp, cc, hh)",
  //   value: "cpp",
  //   aliases: ["cxx", "hpp", "cc", "hh"],
  // },
  { label: "CSS", value: "css" },
  // { label: "Go (golang)", value: "go", aliases: ["golang"] },
  {
    label: "HTML / XML (html, xhtml, rss, atom, svg)",
    value: "html",
    aliases: ["html", "xhtml", "rss", "atom", "svg"],
  },
  // { label: "Java (jsp)", value: "java", aliases: ["jsp"] },
  {
    label: "JavaScript (js, jsx)",
    value: "javascript",
    aliases: ["js", "jsx"],
  },
  // { label: "JSON (json5, jsonc)", value: "json", aliases: ["json5", "jsonc"] },
  // {
  //   label: "Markdown (md, mkdown, mkd)",
  //   value: "markdown",
  //   aliases: ["md", "mkdown", "mkd"],
  // },
  // { label: "PHP", value: "php" },
  // { label: "Python (py, gyp)", value: "python", aliases: ["py", "gyp"] },
  // { label: "Rust (rs)", value: "rust", aliases: ["rs"] },
  // { label: "SCSS", value: "scss" },
  // { label: "SQL", value: "sql" },
  // {
  //   label: "TypeScript (ts, tsx)",
  //   value: "typescript",
  //   aliases: ["ts", "tsx"],
  // },
  // { label: "YAML (yml)", value: "yaml", aliases: ["yml"] },
];

export const supportedHighlightJsThemes: {
  label: string;
  value: ThemeNames;
}[] = [
  { label: "Abcdef", value: "Abcdef" },
  { label: "Abyss", value: "Abyss" },
  { label: "Androidstudio", value: "AndroidStudio" },
  { label: "Andromeda", value: "Andromeda" },
  { label: "Atomone", value: "Atomone" },
  { label: "Aura", value: "Aura" },

  { label: "Basic Dark", value: "BasicDark" },
  { label: "Basic Light", value: "BasicLight" },
  { label: "Bbedit", value: "Bbedit" },
  { label: "Bespin", value: "Bespin" },

  { label: "Console Dark", value: "ConsoleDark" },
  { label: "Console Light", value: "ConsoleLight" },
  { label: "Copilot", value: "Copilot" },

  { label: "Darcula", value: "Darcula" },
  { label: "Dracula", value: "Dracula" },
  { label: "Duotone Dark", value: "DuotoneDark" },
  { label: "Duotone Light", value: "DuotoneLight" },

  { label: "Eclipse", value: "Eclipse" },

  { label: "Github Dark", value: "GithubDark" },
  { label: "Github Light", value: "GithubLight" },
  { label: "Gruvbox Dark", value: "GruvboxDark" },
  { label: "Gruvbox Light", value: "GruvboxLight" },

  { label: "Kimbie", value: "Kimbie" },

  { label: "Material Dark", value: "MaterialDark" },
  { label: "Material Light", value: "MaterialLight" },
  { label: "Monokai", value: "Monokai" },
  { label: "Monokai Dimmed", value: "MonokaiDimmed" },

  { label: "Noctis Lilac", value: "NoctisLilac" },
  { label: "Nord", value: "Nord" },

  { label: "Okaidia", value: "Okaidia" },

  { label: "Quietlight", value: "Quietlight" },

  { label: "Red", value: "Red" },

  { label: "Solarized Dark", value: "SolarizedDark" },
  { label: "Solarized Light", value: "SolarizedLight" },
  { label: "Sublime", value: "Sublime" },

  { label: "Tokyo Night", value: "TokyoNight" },
  { label: "Tokyo Night Storm", value: "TokyoNightStorm" },
  { label: "Tokyo Night Day", value: "TokyoNightDay" },
  { label: "Tomorrow Night Blue", value: "TomorrowNightBlue" },

  { label: "Vscode Dark", value: "VscodeDark" },
  { label: "Vscode Light", value: "VscodeLight" },

  { label: "White Dark", value: "WhiteDark" },
  { label: "White Light", value: "WhiteLight" },

  { label: "Xcode Dark", value: "XcodeDark" },
  { label: "Xcode Light", value: "XcodeLight" },
];

export const codeEditorConfig = {
  fontSize: 12,
};

export const predefinedEditorFontSize = [
  10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96,
];
