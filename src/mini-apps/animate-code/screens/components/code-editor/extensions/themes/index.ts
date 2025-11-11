import { abcdef, abcdefDarkStyle, defaultSettingsAbcdef } from "./abcdef";
import { abyss, abyssDarkStyle, defaultSettingsAbyss } from "./abyss";
import {
  androidstudio,
  androidstudioDarkStyle,
  defaultSettingsAndroidstudio,
} from "./androidstudio";
import {
  andromeda,
  andromedaDarkStyle,
  defaultSettingsAndromeda,
} from "./andromeda";
import { atomone, atomoneDarkStyle, defaultSettingsAtomone } from "./atomone";
import { aura, auraDarkStyle, defaultSettingsAura } from "./aura";
import {
  basicDark,
  basicDarkStyle,
  basicLight,
  basicLightStyle,
  defaultSettingsBasicDark,
  defaultSettingsBasicLight,
} from "./basic";
import { bbedit, bbeditLightStyle, defaultSettingsBbedit } from "./bbedit";
import { bespin, bespinDarkStyle, defaultSettingsBespin } from "./bespin";
import {
  consoleDark,
  consoleLight,
  defaultSettingsConsoleDark,
  defaultSettingsConsoleLight,
} from "./console";
import { copilot, copilotDarkStyle, defaultSettingsCopilot } from "./copilot";
import { darcula, darculaDarkStyle, defaultSettingsDarcula } from "./darcula";
import { defaultSettingsDracula, dracula, draculaDarkStyle } from "./dracula";
import {
  defaultSettingsDuotoneDark,
  defaultSettingsDuotoneLight,
  duotoneDark,
  duotoneDarkStyle,
  duotoneLight,
} from "./duotone";
import { defaultSettingsEclipse, eclipse, eclipseLightStyle } from "./eclipse";
import {
  defaultSettingsGithubDark,
  defaultSettingsGithubLight,
  githubDark,
  githubDarkStyle,
  githubLight,
  githubLightStyle,
} from "./github";
import {
  defaultSettingsGruvboxDark,
  defaultSettingsGruvboxLight,
  gruvboxDark,
  gruvboxDarkStyle,
  gruvboxLight,
  gruvboxLightStyle,
} from "./gruvbox";
import { defaultSettingsKimbie, kimbie, kimbieDarkStyle } from "./kimbie";
import {
  defaultSettingsMaterialDark,
  defaultSettingsMaterialLight,
  materialDark,
  materialDarkStyle,
  materialLight,
  materialLightStyle,
} from "./material";
import { defaultSettingsMonokai, monokai, monokaiDarkStyle } from "./monokai";
import {
  defaultSettingsMonokaiDimmed,
  monokaiDimmed,
  monokaiDimmedDarkStyle,
} from "./monokai-dimmed";
import {
  defaultSettingsNoctisLilac,
  noctisLilac,
  noctisLilacLightStyle,
} from "./noctis-lilac";
import { defaultSettingsNord, nord, nordDarkStyle } from "./nord";
import { defaultSettingsOkaidia, okaidia, okaidiaDarkStyle } from "./okaidia";
import {
  defaultSettingsQuietlight,
  quietlight,
  quietlightStyle,
} from "./quietlight";
import { defaultSettingsRed, red, redDarkStyle } from "./red";
import {
  defaultSettingsSolarizedDark,
  defaultSettingsSolarizedLight,
  solarizedDark,
  solarizedDarkStyle,
  solarizedLight,
  solarizedLightStyle,
} from "./solarized";
import { defaultSettingsSublime, sublime, sublimeDarkStyle } from "./sublime";
import {
  defaultSettingsTokyoNight,
  tokyoNight,
  tokyoNightStyle,
} from "./tokyo-night";
import {
  defaultSettingsTokyoNightStorm,
  tokyoNightStorm,
  tokyoNightStormStyle,
} from "./tokyo-night-storm";
import {
  defaultSettingsTokyoNightDay,
  tokyoNightDay,
  tokyoNightDayStyle,
} from "./tokyo-night-day";
import {
  defaultSettingsTomorrowNightBlue,
  tomorrowNightBlue,
  tomorrowNightBlueStyle,
} from "./tomorrow-night-blue";
import {
  defaultSettingsVscodeDark,
  defaultSettingsVscodeLight,
  vscodeDark,
  vscodeDarkStyle,
  vscodeLight,
  vscodeLightStyle,
} from "./vscode";
import {
  defaultSettingsWhiteDark,
  defaultSettingsWhiteLight,
  whiteDark,
  whiteDarkStyle,
  whiteLight,
  whiteLightStyle,
} from "./white";
import {
  defaultSettingsXcodeDark,
  defaultSettingsXcodeLight,
  xcodeDark,
  xcodeDarkStyle,
  xcodeLight,
  xcodeLightStyle,
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

export const BaseThemeStyle = {
  Abcdef: abcdefDarkStyle,
  Abyss: abyssDarkStyle,
  AndroidStudio: androidstudioDarkStyle,
  Andromeda: andromedaDarkStyle,
  Atomone: atomoneDarkStyle,
  Aura: auraDarkStyle,

  BasicDark: basicDarkStyle,
  BasicLight: basicLightStyle,
  Bbedit: bbeditLightStyle,
  Bespin: bespinDarkStyle,

  ConsoleDark: [],
  ConsoleLight: [],
  Copilot: copilotDarkStyle,

  Darcula: darculaDarkStyle,
  Dracula: draculaDarkStyle,
  DuotoneDark: duotoneDarkStyle,
  DuotoneLight: duotoneDarkStyle,

  Eclipse: eclipseLightStyle,

  GithubDark: githubDarkStyle,
  GithubLight: githubLightStyle,
  GruvboxDark: gruvboxDarkStyle,
  GruvboxLight: gruvboxLightStyle,

  Kimbie: kimbieDarkStyle,

  MaterialDark: materialDarkStyle,
  MaterialLight: materialLightStyle,
  Monokai: monokaiDarkStyle,
  MonokaiDimmed: monokaiDimmedDarkStyle,

  NoctisLilac: noctisLilacLightStyle,
  Nord: nordDarkStyle,

  Okaidia: okaidiaDarkStyle,

  Quietlight: quietlightStyle,

  Red: redDarkStyle,

  SolarizedDark: solarizedDarkStyle,
  SolarizedLight: solarizedLightStyle,
  Sublime: sublimeDarkStyle,

  TokyoNight: tokyoNightStyle,
  TokyoNightStorm: tokyoNightStormStyle,
  TokyoNightDay: tokyoNightDayStyle,
  TomorrowNightBlue: tomorrowNightBlueStyle,

  VscodeDark: vscodeDarkStyle,
  VscodeLight: vscodeLightStyle,

  WhiteDark: whiteDarkStyle,
  WhiteLight: whiteLightStyle,

  XcodeDark: xcodeDarkStyle,
  XcodeLight: xcodeLightStyle,
} as const;
