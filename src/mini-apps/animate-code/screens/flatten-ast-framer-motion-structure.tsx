import { Parser, Language } from "web-tree-sitter";

interface TokenNode {
  type: string;
  text: string;
  layoutId: string;
  children?: TokenNode[];
}

export async function generateASTStructure(source: string) {
  await Parser.init({ locateFile: () => "/tree-sitter.wasm" });
  const parser = new Parser();
  const Lang = await Language.load("/tree-sitter-html.wasm");

  console.log("SOURCE: ", source, Lang.version);
  if (!Lang.version) {
    return;
  }

  parser.setLanguage(Lang);

  const tree = parser.parse(source);
  const root = tree.rootNode;

  console.log("root: ", root);
  // Recursive traversal
  function traverse(node: any, path: string = ""): TokenNode[] {
    const tokens: TokenNode[] = [];

    if (node.type === "element") {
      const openTag = node.childForFieldName("start_tag") || node.firstChild;
      const closeTag = node.childForFieldName("end_tag") || node.lastChild;
      const tagNameNode =
        openTag.childForFieldName("tag_name") || openTag.firstChild;

      // Open tag
      tokens.push({
        type: "open-tag",
        text: source.slice(openTag.startIndex, openTag.endIndex),
        layoutId: `open-${tagNameNode.text}-${openTag.startIndex}-${openTag.endIndex}`,
      });

      // Attributes
      if (openTag.childForFieldName("attributes")) {
        const attrs = openTag.childForFieldName("attributes");
        for (let i = 0; i < attrs.namedChildCount; i++) {
          const attr = attrs.namedChild(i);
          tokens.push({
            type: "attribute",
            text: source.slice(attr.startIndex, attr.endIndex),
            layoutId: `attr-${attr.text}-${attr.startIndex}-${attr.endIndex}`,
          });
        }
      }

      // Recursively traverse children
      for (let i = 0; i < node.namedChildCount; i++) {
        const child = node.namedChild(i);
        if (child.type !== "start_tag" && child.type !== "end_tag") {
          tokens.push(...traverse(child, path + "/" + i));
        }
      }

      // Close tag
      if (closeTag) {
        tokens.push({
          type: "close-tag",
          text: source.slice(closeTag.startIndex, closeTag.endIndex),
          layoutId: `close-${tagNameNode.text}-${closeTag.startIndex}-${closeTag.endIndex}`,
        });
      }
    } else if (node.type === "text") {
      tokens.push({
        type: "text",
        text: source.slice(node.startIndex, node.endIndex),
        layoutId: `text-${node.startIndex}-${node.endIndex}`,
      });
    }

    return tokens;
  }

  const structure = traverse(root);
  return structure;
}
