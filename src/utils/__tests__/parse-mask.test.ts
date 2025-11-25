import { parseMask } from "../parse-mask";

describe("parseMask", () => {
  it("should parse mask with asterisks", () => {
    const result = parseMask("(***) - *** - ** - **");
    
    expect(result.inputCount).toBe(10);
    expect(result.parts.length).toBeGreaterThan(0);
    expect(result.parts[0].type).toBe("literal");
    expect(result.parts[0].value).toBe("(");
    // Find first input part
    const firstInput = result.parts.find((p) => p.type === "input");
    expect(firstInput).toBeDefined();
    expect(firstInput?.type).toBe("input");
  });

  it("should parse simple mask", () => {
    const result = parseMask("****");
    
    expect(result.inputCount).toBe(4);
    expect(result.parts).toHaveLength(4);
    result.parts.forEach((part) => {
      expect(part.type).toBe("input");
    });
  });

  it("should parse mask with only literals", () => {
    const result = parseMask("abc");
    
    expect(result.inputCount).toBe(0);
    expect(result.parts).toHaveLength(1);
    expect(result.parts[0].type).toBe("literal");
    expect(result.parts[0].value).toBe("abc");
  });

  it("should handle empty mask", () => {
    const result = parseMask("");
    
    expect(result.inputCount).toBe(0);
    expect(result.parts).toHaveLength(0);
  });
});

