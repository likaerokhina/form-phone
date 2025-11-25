import type { Meta, StoryObj } from "@storybook/react";

import PhoneInput from "./phone-input";

const meta: Meta<typeof PhoneInput> = {
  title: "Components/PhoneInput",
  component: PhoneInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Phone value (can be formatted or unformatted)",
    },
    onChange: {
      action: "changed",
      description: "Callback fired when phone value changes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

const defaultMasks = [
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
  {
    key: "uk",
    name: "Великобритания",
    emoji: "🇬🇧",
    prefix: "+44",
    mask: "**** **** ****",
  },
  {
    key: "de",
    name: "Германия",
    emoji: "🇩🇪",
    prefix: "+49",
    mask: "*** / **** - ****",
  },
];

export const Default: Story = {
  args: {
    masks: defaultMasks,
    value: "",
    onChange: () => {},
  },
};

export const WithValue: Story = {
  args: {
    masks: defaultMasks,
    value: "+7 (123) - 456 - 78 - 90",
    onChange: () => {},
  },
};

export const WithFormattedValue: Story = {
  args: {
    masks: defaultMasks,
    value: "+71234567890",
    onChange: () => {},
  },
};

export const SingleMask: Story = {
  args: {
    masks: [
      {
        key: "ru",
        name: "Россия",
        emoji: "🇷🇺",
        prefix: "+7",
        mask: "(***) - *** - ** - **",
      },
    ],
    value: "",
    onChange: () => {},
  },
};

export const Interactive: Story = {
  args: {
    masks: defaultMasks,
    value: "",
    onChange: (value) => {
      console.log("Phone value changed:", value);
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive example - try typing numbers and using keyboard navigation (Tab, Arrow keys, Backspace). Click on the flag to change country.",
      },
    },
  },
};

