import { action, computed, makeObservable, observable, runInAction } from "mobx";

import { MaskConfig, PhoneInputStoreOptions } from "../types";
import { ILocalStore } from "./interfaces/ILocalStore";

import { extractDigitsFromFormatted, formatPhone, normalizePhone } from "../utils/format-phone";
import { parseMask } from "../utils/parse-mask";

export class PhoneInputStore implements ILocalStore {
  private _masks: MaskConfig[] = [];
  private _currentMaskIndex = 0;
  private _digits: string = "";
  private _focusedInputIndex = 0;
  private _isDropdownOpen = false;
  private _onChange: (value: string) => void;
  private _inputRefs: Array<HTMLInputElement | null> = [];
  private _lastExternalValue: string = "";

  constructor(options: PhoneInputStoreOptions) {
    this._masks = options.masks;
    this._onChange = options.onChange;
    this._lastExternalValue = options.value || "";

    if (options.value) {
      this._setValueFromExternal(options.value);
    }

    makeObservable(this, {
      _masks: observable,
      _currentMaskIndex: observable,
      _digits: observable,
      _focusedInputIndex: observable,
      _isDropdownOpen: observable,
      currentMask: computed,
      inputCount: computed,
      formattedValue: computed,
      isValid: computed,
      focusedInputIndex: computed,
      isDropdownOpen: computed,
      masks: computed,
      digits: computed,
      handleInputChange: action.bound,
      handleKeyDown: action.bound,
      handleMaskSelect: action.bound,
      setFocusedIndex: action.bound,
      toggleDropdown: action.bound,
      closeDropdown: action.bound,
      setInputRef: action.bound,
      validate: action.bound,
      updateValue: action.bound,
      updateOnChange: action.bound,
      destroy: action.bound,
    } as any);
  }

  get currentMask(): MaskConfig {
    return this._masks[this._currentMaskIndex] ?? this._masks[0];
  }

  get inputCount(): number {
    const parsed = parseMask(this.currentMask.mask);
    return parsed.inputCount;
  }

  get formattedValue(): string {
    if (!this._digits) {
      return this.currentMask.prefix;
    }
    return formatPhone(this._digits, this.currentMask);
  }

  get isValid(): boolean {
    return this._digits.length === this.inputCount;
  }

  get focusedInputIndex(): number {
    return this._focusedInputIndex;
  }

  get isDropdownOpen(): boolean {
    return this._isDropdownOpen;
  }

  get masks(): MaskConfig[] {
    return this._masks;
  }

  get digits(): string {
    return this._digits;
  }

  private _setValueFromExternal(value: string): void {
    if (!value) {
      this._digits = "";
      return;
    }

    const normalized = normalizePhone(value);
    
    for (let i = 0; i < this._masks.length; i++) {
      const mask = this._masks[i];
      const extracted = extractDigitsFromFormatted(value, mask.prefix);
      
      if (extracted.length > 0) {
        const parsed = parseMask(mask.mask);
        if (extracted.length <= parsed.inputCount) {
          this._currentMaskIndex = i;
          this._digits = extracted;
          return;
        }
      }
    }
    
    if (normalized.length > 0) {
      const currentParsed = parseMask(this.currentMask.mask);
      this._digits = normalized.slice(0, currentParsed.inputCount);
    } else {
      this._digits = "";
    }
  }

  handleInputChange(index: number, value: string): void {
    const digit = value.slice(-1).replace(/\D/g, "");
    
    if (!digit && value === "") {
      this._digits = this._digits.slice(0, index) + this._digits.slice(index + 1);
      this._moveToPrevious(index);
      this._notifyChange();
      return;
    }

    if (digit && /^\d$/.test(digit)) {
      const newDigits =
        this._digits.slice(0, index) + digit + this._digits.slice(index + 1);
      
      this._digits = newDigits.slice(0, this.inputCount);
      this._notifyChange();
      
      if (index < this.inputCount - 1) {
        this._moveToNext(index);
      }
    }
  }

  handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    const { key, currentTarget } = event;
    const index = parseInt(currentTarget.dataset.index || "0", 10);

    switch (key) {
      case "Tab":
        if (!event.shiftKey) {
          event.preventDefault();
          this._moveToNext(index);
        }
        break;

      case "ArrowLeft":
        event.preventDefault();
        this._moveToPrevious(index);
        break;

      case "ArrowRight":
        event.preventDefault();
        this._moveToNext(index);
        break;

      case "Backspace":
        if (currentTarget.value === "") {
          event.preventDefault();
          this.handleInputChange(index, "");
        }
        break;

      case "Enter":
        event.preventDefault();
        this.validate();
        break;

      default:
        break;
    }
  }

  handleMaskSelect(maskIndex: number): void {
    if (maskIndex >= 0 && maskIndex < this._masks.length) {
      this._currentMaskIndex = maskIndex;
      this._digits = this._digits.slice(0, this.inputCount);
      this._focusedInputIndex = 0;
      this._isDropdownOpen = false;
      this._notifyChange();
    }
  }

  setFocusedIndex(index: number): void {
    if (index >= 0 && index < this.inputCount) {
      this._focusedInputIndex = index;
      this._focusInput(index);
    }
  }

  toggleDropdown(): void {
    this._isDropdownOpen = !this._isDropdownOpen;
  }

  closeDropdown(): void {
    this._isDropdownOpen = false;
  }

  setInputRef(index: number, ref: HTMLInputElement | null): void {
    this._inputRefs[index] = ref;
  }

  validate(): void {
    if (this.isValid) {
      this._notifyChange();
    }
  }

  updateValue(newValue: string): void {
    if (newValue !== this._lastExternalValue && newValue !== this.formattedValue) {
      this._lastExternalValue = newValue;
      this._setValueFromExternal(newValue);
    }
  }

  updateOnChange(newOnChange: (value: string) => void): void {
    this._onChange = newOnChange;
  }

  private _moveToNext(index: number): void {
    if (index < this.inputCount - 1) {
      this._focusedInputIndex = index + 1;
      this._focusInput(this._focusedInputIndex);
    }
  }

  private _moveToPrevious(index: number): void {
    if (index > 0) {
      this._focusedInputIndex = index - 1;
      this._focusInput(this._focusedInputIndex);
    }
  }

  private _focusInput(index: number): void {
    runInAction(() => {
      setTimeout(() => {
        const ref = this._inputRefs[index];
        if (ref) {
          ref.focus();
          ref.select();
        }
      }, 0);
    });
  }

  private _notifyChange(): void {
    if (this._onChange) {
      this._onChange(this.formattedValue);
    }
  }

  destroy(): void {
    this._inputRefs = [];
    this._digits = "";
    this._focusedInputIndex = 0;
    this._isDropdownOpen = false;
  }
}

