import { abcdef, defaultSettingsAbcdef } from "./abcdef";
import { abyss, defaultSettingsAbyss } from "./abyss";
import { androidstudio, defaultSettingsAndroidstudio } from "./androidstudio";
import { andromeda, defaultSettingsAndromeda } from "./andromeda";
import { atomone, defaultSettingsAtomone } from "./atomone";
import { aura, defaultSettingsAura } from "./aura";
import {
  basicDark,
  basicLight,
  defaultSettingsBasicDark,
  defaultSettingsBasicLight,
} from "./basic";
import { bbedit, defaultSettingsBbedit } from "./bbedit";
import { bespin, defaultSettingsBespin } from "./bespin";
import {
  consoleDark,
  consoleLight,
  defaultSettingsConsoleDark,
  defaultSettingsConsoleLight,
} from "./console";
import { copilot, defaultSettingsCopilot } from "./copilot";
import { darcula, defaultSettingsDarcula } from "./darcula";
import { defaultSettingsDracula, dracula } from "./dracula";
import {
  defaultSettingsDuotoneDark,
  defaultSettingsDuotoneLight,
  duotoneDark,
  duotoneLight,
} from "./duotone";
import { defaultSettingsEclipse, eclipse } from "./eclipse";
import {
  defaultSettingsGithubDark,
  defaultSettingsGithubLight,
  githubDark,
  githubLight,
} from "./github";
import {
  defaultSettingsGruvboxDark,
  defaultSettingsGruvboxLight,
  gruvboxDark,
  gruvboxLight,
} from "./gruvbox";
import { defaultSettingsKimbie, kimbie } from "./kimbie";
import {
  defaultSettingsMaterialDark,
  defaultSettingsMaterialLight,
  materialDark,
  materialLight,
} from "./material";
import { defaultSettingsMonokai, monokai } from "./monokai";
import { defaultSettingsMonokaiDimmed, monokaiDimmed } from "./monokai-dimmed";
import { defaultSettingsNoctisLilac, noctisLilac } from "./noctis-lilac";
import { defaultSettingsNord, nord } from "./nord";
import { defaultSettingsOkaidia, okaidia } from "./okaidia";
import { defaultSettingsQuietlight, quietlight } from "./quietlight";
import { defaultSettingsRed, red } from "./red";
import {
  defaultSettingsSolarizedDark,
  defaultSettingsSolarizedLight,
  solarizedDark,
  solarizedLight,
} from "./solarized";
import { defaultSettingsSublime, sublime } from "./sublime";
import { defaultSettingsTokyoNight, tokyoNight } from "./tokyo-night";
import {
  defaultSettingsTokyoNightStorm,
  tokyoNightStorm,
} from "./tokyo-night-storm";
import { defaultSettingsTokyoNightDay, tokyoNightDay } from "./tokyo-night-day";
import {
  defaultSettingsTomorrowNightBlue,
  tomorrowNightBlue,
} from "./tomorrow-night-blue";
import {
  defaultSettingsVscodeDark,
  defaultSettingsVscodeLight,
  vscodeDark,
  vscodeLight,
} from "./vscode";
import {
  defaultSettingsWhiteDark,
  defaultSettingsWhiteLight,
  whiteDark,
  whiteLight,
} from "./white";
import {
  defaultSettingsXcodeDark,
  defaultSettingsXcodeLight,
  xcodeDark,
  xcodeLight,
} from "./xcode";

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

export const BaseThemeColor = {
  Abcdef: defaultSettingsAbcdef,
  Abyss: defaultSettingsAbyss,
  AndroidStudio: defaultSettingsAndroidstudio,
  Andromeda: defaultSettingsAndromeda,
  Atomone: defaultSettingsAtomone,
  Aura: defaultSettingsAura,

  BasicDark: defaultSettingsBasicDark,
  BasicLight: defaultSettingsBasicLight,
  Bbedit: defaultSettingsBbedit,
  Bespin: defaultSettingsBespin,

  ConsoleDark: defaultSettingsConsoleDark,
  ConsoleLight: defaultSettingsConsoleLight,
  Copilot: defaultSettingsCopilot,

  Darcula: defaultSettingsDarcula,
  Dracula: defaultSettingsDracula,
  DuotoneDark: defaultSettingsDuotoneDark,
  DuotoneLight: defaultSettingsDuotoneLight,

  Eclipse: defaultSettingsEclipse,

  GithubDark: defaultSettingsGithubDark,
  GithubLight: defaultSettingsGithubLight,
  GruvboxDark: defaultSettingsGruvboxDark,
  GruvboxLight: defaultSettingsGruvboxLight,

  Kimbie: defaultSettingsKimbie,

  MaterialDark: defaultSettingsMaterialDark,
  MaterialLight: defaultSettingsMaterialLight,
  Monokai: defaultSettingsMonokai,
  MonokaiDimmed: defaultSettingsMonokaiDimmed,

  NoctisLilac: defaultSettingsNoctisLilac,
  Nord: defaultSettingsNord,

  Okaidia: defaultSettingsOkaidia,

  Quietlight: defaultSettingsQuietlight,

  Red: defaultSettingsRed,

  SolarizedDark: defaultSettingsSolarizedDark,
  SolarizedLight: defaultSettingsSolarizedLight,
  Sublime: defaultSettingsSublime,

  TokyoNight: defaultSettingsTokyoNight,
  TokyoNightStorm: defaultSettingsTokyoNightStorm,
  TokyoNightDay: defaultSettingsTokyoNightDay,
  TomorrowNightBlue: defaultSettingsTomorrowNightBlue,

  VscodeDark: defaultSettingsVscodeDark,
  VscodeLight: defaultSettingsVscodeLight,

  WhiteDark: defaultSettingsWhiteDark,
  WhiteLight: defaultSettingsWhiteLight,

  XcodeDark: defaultSettingsXcodeDark,
  XcodeLight: defaultSettingsXcodeLight,
} as const;

export type ThemeNames = keyof typeof Themes;

export const ThemeNames = Object.keys(Themes).reduce(
  (acc: Record<any, any>, v: any) => {
    acc[v] = v;
    return acc;
  },
  {},
) as Record<keyof typeof Themes, keyof typeof Themes>;
