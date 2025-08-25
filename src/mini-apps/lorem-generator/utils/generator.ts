
export const LEXICON = [
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor",
  "incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis",
  "nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
  "duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
  "eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt",
  "in culpa qui officia deserunt mollit anim id est laborum",
]

export function makeWord(value: number) {
  const baseValue = LEXICON.join(" ").split(" ")
  return Array.from({ length: value }, (_, index) => {
    return baseValue[index % baseValue.length]
  }).join(" ")
}

export function makeSentence(value: number) {
  return Array.from({ length: value }, (_, index) => {
    return LEXICON[index % LEXICON.length]
  }).join(" ")

}

export function makeParagraph(value: number) {
  return Array.from({ length: value }, () => LEXICON.join(" ")).join("\n\n");
}
