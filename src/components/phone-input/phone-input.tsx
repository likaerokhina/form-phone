import cn from "clsx";
import { observer } from "mobx-react-lite";
import * as React from "react";

import { PhoneInputProps } from "../../types";
import { PhoneInputStore } from "../../store/PhoneInputStore";

import { parseMask } from "../../utils/parse-mask";

import s from "./phone-input.module.scss";

const PhoneInput: React.FC<PhoneInputProps> = observer(({ masks, value, onChange }) => {
  const store = React.useMemo(
    () => new PhoneInputStore({ masks, value, onChange }),
    [masks],
  );

  React.useEffect(() => {
    store.updateValue(value);
  }, [value, store]);

  React.useEffect(() => {
    store.updateOnChange(onChange);
  }, [onChange, store]);

  React.useEffect(() => {
    return () => {
      store.destroy();
    };
  }, [store]);

  const handleClickOutside = React.useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdown = document.querySelector(`.${s.root__dropdown}`);
      const flag = document.querySelector(`.${s.root__flag}`);

      if (
        dropdown &&
        flag &&
        !dropdown.contains(target) &&
        !flag.contains(target)
      ) {
        store.closeDropdown();
      }
    },
    [store],
  );

  React.useEffect(() => {
    if (store.isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [store.isDropdownOpen, handleClickOutside]);

  const parsedMask = React.useMemo(
    () => parseMask(store.currentMask.mask),
    [store.currentMask.mask],
  );

  const getInputValue = React.useCallback(
    (index: number): string => {
      return store.digits[index] ?? "";
    },
    [store.digits],
  );

  const renderInputs = (): React.ReactNode[] => {
    const inputs: React.ReactNode[] = [];
    let inputIndex = 0;

    parsedMask.parts.forEach((part, partIndex) => {
      if (part.type === "literal") {
        inputs.push(
          <span key={`literal-${partIndex}`} className={s.root__literal}>
            {part.value}
          </span>,
        );
      } else if (part.type === "input") {
        const currentIndex = inputIndex;
        inputs.push(
          <input
            key={`input-${currentIndex}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className={cn(s.root__input, {
              [s["root__input--focused"]]: store.focusedInputIndex === currentIndex,
            })}
            value={getInputValue(currentIndex)}
            data-index={currentIndex}
            ref={(ref) => store.setInputRef(currentIndex, ref)}
            onChange={(e) => store.handleInputChange(currentIndex, e.target.value)}
            onKeyDown={store.handleKeyDown}
            onFocus={() => store.setFocusedIndex(currentIndex)}
            onClick={() => store.setFocusedIndex(currentIndex)}
            aria-label={`Input ${currentIndex + 1} of ${store.inputCount}`}
          />,
        );
        inputIndex++;
      }
    });

    return inputs;
  };

  return (
    <div className={s.root}>
      <button
        type="button"
        className={s.root__flag}
        onClick={store.toggleDropdown}
        aria-label="Select country"
        aria-expanded={store.isDropdownOpen}
      >
        <span className={s.root__flagEmoji}>{store.currentMask.emoji}</span>
        <span className={s.root__flagPrefix}>{store.currentMask.prefix}</span>
      </button>

      <div className={s.root__inputs}>{renderInputs()}</div>

      {store.isDropdownOpen && (
        <div className={s.root__dropdown} role="listbox">
          {store.masks.map((mask, index) => (
            <button
              key={mask.key}
              type="button"
              className={cn(s.root__dropdownItem, {
                [s["root__dropdownItem--active"]]: store.currentMask.key === mask.key,
              })}
              onClick={() => store.handleMaskSelect(index)}
              role="option"
              aria-selected={store.currentMask.key === mask.key}
            >
              <span className={s.root__dropdownEmoji}>{mask.emoji}</span>
              <span className={s.root__dropdownName}>{mask.name}</span>
              <span className={s.root__dropdownPrefix}>{mask.prefix}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

export default React.memo(PhoneInput);

