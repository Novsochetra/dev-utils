import { abcdef } from "./abcdef";
import { abyss } from "./abyss";
import { androidstudio } from "./androidstudio";
import { andromeda } from "./andromeda";
import { atomone } from "./atomone";
import { aura } from "./aura";
import { basicDark, basicLight } from "./basic";
import { bbedit } from "./bbedit";
import { bespin } from "./bespin";
import { consoleDark, consoleLight } from "./console";
import { copilot } from "./copilot";
import { darcula } from "./darcula";
import { dracula } from "./dracula";
import { duotoneDark, duotoneLight } from "./duotone";
import { eclipse } from "./eclipse";
import { githubDark, githubLight } from "./github";
import { gruvboxDark, gruvboxLight } from "./gruvbox";
import { kimbie } from "./kimbie";
import { materialDark, materialLight } from "./material";
import { monokai } from "./monokai";
import { monokaiDimmed } from "./monokai-dimmed";
import { noctisLilac } from "./noctis-lilac";
import { nord } from "./nord";
import { okaidia } from "./okaidia";
import { quietlight } from "./quietlight";
import { red } from "./red";
import { solarizedDark, solarizedLight } from "./solarized";
import { sublime } from "./sublime";
import { tokyoNight } from "./tokyo-night";
import { tokyoNightStorm } from "./tokyo-night-storm";
import { tokyoNightDay } from "./tokyo-night-day";
import { tomorrowNightBlue } from "./tomorrow-night-blue";
import { vscodeDark, vscodeLight } from "./vscode";
import { whiteDark, whiteLight } from "./white";
import { xcodeDark, xcodeLight } from "./xcode";

export const Themes = {
  Abcdef: abcdef,
  Abyss: abyss,
  AndroidStudio: androidstudio,
  Andromeda: andromeda,
  Atomone: atomone,
  Aura: aura,

  BasicDark: basicDark,
  BasicLight: basicLight,
  Bbedit: bbedit,
  Bespin: bespin,

  ConsoleDark: consoleDark,
  ConsoleLight: consoleLight,
  Copilot: copilot,

  Darcula: darcula,
  Dracula: dracula,
  DuotoneDark: duotoneDark,
  DuotoneLight: duotoneLight,

  Eclipse: eclipse,

  GithubDark: githubDark,
  GithubLight: githubLight,
  GruvboxDark: gruvboxDark,
  GruvboxLight: gruvboxLight,

  Kimbie: kimbie,

  MaterialDark: materialDark,
  MaterialLight: materialLight,
  Monokai: monokai,
  MonokaiDimmed: monokaiDimmed,

  NoctisLilac: noctisLilac,
  Nord: nord,

  Okaidia: okaidia,

  Quietlight: quietlight,

  Red: red,

  SolarizedDark: solarizedDark,
  SolarizedLight: solarizedLight,
  Sublime: sublime,

  TokyoNight: tokyoNight,
  TokyoNightStorm: tokyoNightStorm,
  TokyoNightDay: tokyoNightDay,
  TomorrowNightBlue: tomorrowNightBlue,

  VscodeDark: vscodeDark,
  VscodeLight: vscodeLight,

  WhiteDark: whiteDark,
  WhiteLight: whiteLight,

  XcodeDark: xcodeDark,
  XcodeLight: xcodeLight,
} as const;

export type ThemeNames = keyof typeof Themes;

export const ThemeNames = Object.keys(Themes).reduce(
  (acc: Record<any, any>, v: any) => {
    acc[v] = v;
    return acc;
  },
  {},
) as Record<keyof typeof Themes, keyof typeof Themes>;
