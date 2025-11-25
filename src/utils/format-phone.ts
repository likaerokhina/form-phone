import { MaskConfig } from "@types";

import { parseMask, ParsedMask } from "./parse-mask";

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatPhone(
  digits: string,
  maskConfig: MaskConfig,
): string {
  const { prefix, mask } = maskConfig;
  const parsed = parseMask(mask);
  let digitIndex = 0;
  let result = prefix;

  for (const part of parsed.parts) {
    if (part.type === "literal") {
      result += part.value;
    } else if (part.type === "input" && digitIndex < digits.length) {
      result += digits[digitIndex];
      digitIndex++;
    }
  }

  return result;
}

export function extractDigitsFromFormatted(
  formattedValue: string,
  prefix: string,
): string {
  const withoutPrefix = formattedValue.startsWith(prefix)
    ? formattedValue.slice(prefix.length)
    : formattedValue;
  return normalizePhone(withoutPrefix);
}

