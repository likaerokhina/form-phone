export type ParsedMask = {
  parts: Array<{ type: "literal" | "input"; value: string }>;
  inputCount: number;
};

export function parseMask(mask: string): ParsedMask {
  const parts: Array<{ type: "literal" | "input"; value: string }> = [];
  let inputCount = 0;
  let i = 0;

  while (i < mask.length) {
    if (mask[i] === "*") {
      parts.push({ type: "input", value: "" });
      inputCount++;
      i++;
    } else {
      let literal = "";
      while (i < mask.length && mask[i] !== "*") {
        literal += mask[i];
        i++;
      }
      if (literal) {
        parts.push({ type: "literal", value: literal });
      }
    }
  }

  return { parts, inputCount };
}

