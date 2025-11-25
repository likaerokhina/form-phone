import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PhoneInput from "../phone-input";

const mockMasks = [
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

describe("PhoneInput", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("should render component with default mask", () => {
    render(<PhoneInput masks={mockMasks} value="" onChange={mockOnChange} />);
    
    expect(screen.getByText("🇷🇺")).toBeInTheDocument();
    expect(screen.getByText("+7")).toBeInTheDocument();
  });

  it("should render all input fields", () => {
    render(<PhoneInput masks={mockMasks} value="" onChange={mockOnChange} />);
    
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(10);
  });

  it("should update value when typing in input", async () => {
    const user = userEvent.setup();
    render(<PhoneInput masks={mockMasks} value="" onChange={mockOnChange} />);
    
    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "1");
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it("should open dropdown when flag is clicked", async () => {
    const user = userEvent.setup();
    render(<PhoneInput masks={mockMasks} value="" onChange={mockOnChange} />);
    
    const flagButton = screen.getByRole("button", { name: /select country/i });
    await user.click(flagButton);
    
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Россия")).toBeInTheDocument();
    expect(screen.getByText("США")).toBeInTheDocument();
  });

  it("should change mask when dropdown item is clicked", async () => {
    const user = userEvent.setup();
    render(<PhoneInput masks={mockMasks} value="" onChange={mockOnChange} />);
    
    const flagButton = screen.getByRole("button", { name: /select country/i });
    await user.click(flagButton);
    
    const usOption = screen.getByRole("option", { name: /США/i });
    await user.click(usOption);
    
    await waitFor(() => {
      expect(screen.getByText("+1")).toBeInTheDocument();
    });
  });

  it("should handle Tab navigation", async () => {
    const user = userEvent.setup();
    render(<PhoneInput masks={mockMasks} value="" onChange={mockOnChange} />);
    
    const inputs = screen.getAllByRole("textbox");
    inputs[0].focus();
    
    await user.keyboard("{Tab}");
    
    expect(document.activeElement).toBe(inputs[1]);
  });

  it("should handle Arrow key navigation", async () => {
    const user = userEvent.setup();
    render(<PhoneInput masks={mockMasks} value="" onChange={mockOnChange} />);
    
    const inputs = screen.getAllByRole("textbox");
    inputs[1].focus();
    
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(inputs[0]);
    
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(inputs[1]);
  });

  it("should handle Backspace navigation", async () => {
    const user = userEvent.setup();
    render(<PhoneInput masks={mockMasks} value="" onChange={mockOnChange} />);
    
    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "1");
    await user.type(inputs[1], "2");
    
    inputs[2].focus();
    await user.keyboard("{Backspace}");
    
    expect(inputs[1]).toHaveValue("");
  });

  it("should parse initial value correctly", () => {
    render(
      <PhoneInput
        masks={mockMasks}
        value="+7 (123) - 456 - 78 - 90"
        onChange={mockOnChange}
      />,
    );
    
    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("2");
    expect(inputs[2]).toHaveValue("3");
  });
});

