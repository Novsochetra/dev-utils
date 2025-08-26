
export const LEXICON = [
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor",
  "incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis",
  "nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
  "duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
  "eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt",
  "in culpa qui officia deserunt mollit anim id est laborum",
]

export function makeWord(value: number, asHTML: boolean = false) {
  const baseValue = LEXICON.join(" ").split(" ")

  let result = Array.from({ length: value }, (_, index) => {
    return baseValue[index % baseValue.length]
  }).join(" ")

  if (asHTML) {
    result = `<p>${result}</p>`
  }
  return result
}

export function makeSentence(value: number, asHTML: boolean = false) {
  let result = Array.from({ length: value }, (_, index) => {
    return LEXICON[index % LEXICON.length]
  }).join(" ")

  if (asHTML) {
    result = `<p>${result}</p>`
  }

  return result

}

export function makeParagraph(value: number, asHTML: boolean = false) {
  let result;

  if (asHTML) {
    result = Array.from({ length: value }, () => `<p>${LEXICON.join(" ")}</p>`).join("\n\n")
  } else {
    result = Array.from({ length: value }, () => LEXICON.join(" ")).join("\n\n")
  }

  return result
}
