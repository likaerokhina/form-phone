import { MaskConfig } from "../types";

import { parseMask, ParsedMask } from "./parse-mask";

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatPhone(
  digits: string,
  maskConfig: MaskConfig,
): string {
  if (!digits) {
    return maskConfig.prefix;
  }

  const { prefix, mask } = maskConfig;
  const parsed = parseMask(mask);
  let digitIndex = 0;
  let result = prefix;

  for (let i = 0; i < parsed.parts.length; i++) {
    const part = parsed.parts[i];
    
    if (part.type === "input") {
      if (digitIndex < digits.length) {
        result += digits[digitIndex];
        digitIndex++;
      } else {
        break;
      }
    } else if (part.type === "literal") {
      const hasDigitsAfter = digitIndex < digits.length;
      const nextPartIsInput = i + 1 < parsed.parts.length && parsed.parts[i + 1].type === "input";
      const hasDigitsBefore = digitIndex > 0;
      
      if (hasDigitsAfter || (hasDigitsBefore && nextPartIsInput)) {
        result += part.value;
      }
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

