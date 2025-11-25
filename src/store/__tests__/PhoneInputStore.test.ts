import { PhoneInputStore } from "../PhoneInputStore";
import { MaskConfig } from "../../types";

const mockMasks: MaskConfig[] = [
  {
    key: "ru",
    name: "Россия",
    emoji: "🇷🇺",
    prefix: "+7",
    mask: "(***) - *** - ** - **",
  },
  {
    key: "us",
    name: "США",
    emoji: "🇺🇸",
    prefix: "+1",
    mask: "(***) *** - ****",
  },
];

describe("PhoneInputStore", () => {
  let store: PhoneInputStore;
  let mockOnChange: jest.Mock;

  beforeEach(() => {
    mockOnChange = jest.fn();
    store = new PhoneInputStore({
      masks: mockMasks,
      value: "",
      onChange: mockOnChange,
    });
  });

  afterEach(() => {
    store.destroy();
  });

  describe("initialization", () => {
    it("should initialize with first mask", () => {
      expect(store.currentMask.key).toBe("ru");
    });

    it("should initialize with empty digits", () => {
      expect(store.digits).toBe("");
    });

    it("should initialize formatted value with prefix", () => {
      expect(store.formattedValue).toBe("+7");
    });
  });

  describe("handleInputChange", () => {
    it("should add digit to input", () => {
      store.handleInputChange(0, "1");
      expect(store.digits).toBe("1");
    });

    it("should replace digit at index", () => {
      store.handleInputChange(0, "1");
      store.handleInputChange(1, "2");
      store.handleInputChange(0, "3");
      expect(store.digits).toBe("32");
    });

    it("should move to next input after entering digit", () => {
      store.handleInputChange(0, "1");
      expect(store.focusedInputIndex).toBe(1);
    });

    it("should handle backspace to remove digit", () => {
      store.handleInputChange(0, "1");
      store.handleInputChange(1, "2");
      store.handleInputChange(1, "");
      expect(store.digits).toBe("1");
    });
  });

  describe("handleKeyDown", () => {
    it("should move to next input on Tab", () => {
      const mockEvent = {
        key: "Tab",
        shiftKey: false,
        preventDefault: jest.fn(),
        currentTarget: { dataset: { index: "0" } },
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      store.handleKeyDown(mockEvent);
      expect(store.focusedInputIndex).toBe(1);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it("should move to previous input on ArrowLeft", () => {
      store.setFocusedIndex(2);
      const mockEvent = {
        key: "ArrowLeft",
        preventDefault: jest.fn(),
        currentTarget: { dataset: { index: "2" } },
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      store.handleKeyDown(mockEvent);
      expect(store.focusedInputIndex).toBe(1);
    });

    it("should move to next input on ArrowRight", () => {
      const mockEvent = {
        key: "ArrowRight",
        preventDefault: jest.fn(),
        currentTarget: { dataset: { index: "0" } },
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      store.handleKeyDown(mockEvent);
      expect(store.focusedInputIndex).toBe(1);
    });
  });

  describe("handleMaskSelect", () => {
    it("should change current mask", () => {
      store.handleMaskSelect(1);
      expect(store.currentMask.key).toBe("us");
    });

    it("should close dropdown after selection", () => {
      store.toggleDropdown();
      expect(store.isDropdownOpen).toBe(true);
      store.handleMaskSelect(1);
      expect(store.isDropdownOpen).toBe(false);
    });
  });

  describe("validation", () => {
    it("should be invalid when digits count is less than required", () => {
      store.handleInputChange(0, "1");
      expect(store.isValid).toBe(false);
    });

    it("should be valid when all digits are filled", () => {
      for (let i = 0; i < 10; i++) {
        store.handleInputChange(i, String(i));
      }
      expect(store.isValid).toBe(true);
    });
  });

  describe("formattedValue", () => {
    it("should format value according to mask", () => {
      store.handleInputChange(0, "1");
      store.handleInputChange(1, "2");
      store.handleInputChange(2, "3");
      expect(store.formattedValue).toBe("+7 (123");
    });

    it("should format complete phone number", () => {
      "1234567890".split("").forEach((digit, index) => {
        store.handleInputChange(index, digit);
      });
      expect(store.formattedValue).toBe("+7 (123) - 456 - 78 - 90");
    });
  });

  describe("external value update", () => {
    it("should parse external value with prefix", () => {
      const newStore = new PhoneInputStore({
        masks: mockMasks,
        value: "+7 (123) - 456 - 78 - 90",
        onChange: mockOnChange,
      });
      expect(newStore.digits).toBe("1234567890");
      newStore.destroy();
    });
  });

  describe("destroy", () => {
    it("should clean up resources", () => {
      store.handleInputChange(0, "1");
      store.destroy();
      expect(store.digits).toBe("");
      expect(store.focusedInputIndex).toBe(0);
    });
  });
});

