export type MaskConfig = {
  key: string;
  name: string;
  emoji: string;
  prefix: string;
  mask: string;
};

export type PhoneInputProps = {
  masks: MaskConfig[];
  value: string;
  onChange: (value: string) => void;
};

export type PhoneInputStoreOptions = {
  masks: MaskConfig[];
  value: string;
  onChange: (value: string) => void;
};

