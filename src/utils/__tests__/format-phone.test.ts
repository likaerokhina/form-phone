import {
  extractDigitsFromFormatted,
  formatPhone,
  normalizePhone,
} from "../format-phone";
import { MaskConfig } from "../../types";

describe("normalizePhone", () => {
  it("should remove all non-digit characters", () => {
    expect(normalizePhone("+7 (123) 456-78-90")).toBe("71234567890");
    expect(normalizePhone("abc123def456")).toBe("123456");
    expect(normalizePhone("")).toBe("");
  });
});

describe("formatPhone", () => {
  const maskConfig: MaskConfig = {
    key: "ru",
    name: "Россия",
    emoji: "🇷🇺",
    prefix: "+7",
    mask: "(***) - *** - ** - **",
  };

  it("should format phone number with mask", () => {
    expect(formatPhone("1234567890", maskConfig)).toBe(
      "+7(123) - 456 - 78 - 90",
    );
  });

  it("should handle partial digits", () => {
    expect(formatPhone("123", maskConfig)).toBe("+7(123) - ");
  });

  it("should handle empty digits", () => {
    expect(formatPhone("", maskConfig)).toBe("+7");
  });
});

describe("extractDigitsFromFormatted", () => {
  it("should extract digits from formatted value", () => {
    expect(extractDigitsFromFormatted("+7 (123) - 456 - 78 - 90", "+7")).toBe(
      "1234567890",
    );
  });

  it("should handle value without prefix", () => {
    expect(extractDigitsFromFormatted("123 456 7890", "+7")).toBe("1234567890");
  });

  it("should handle empty value", () => {
    expect(extractDigitsFromFormatted("", "+7")).toBe("");
  });
});

