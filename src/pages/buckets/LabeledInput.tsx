import { IconInfo } from '@/components/icons/IconInfo';
import { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface LabeledInputProps extends UseFormRegisterReturn {
  label: string;
  tooltip?: string;
}

export const LabeledInput = forwardRef<HTMLInputElement, LabeledInputProps>(
  (
    {
      label,
      tooltip,

      name,
      onBlur,
      onChange,
      disabled,
      max,
      maxLength,
      minLength,
      min,
      pattern,
      required,
    },
    ref,
  ) => {
    return (
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text flex flex-row gap-2 items-center">
            {label}
            {tooltip && (
              <span className="label-text tooltip" data-tip={tooltip}>
                <IconInfo />
              </span>
            )}
          </span>
        </div>
        <input
          ref={ref}
          className="input input-bordered"
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          name={name}
          disabled={disabled}
          max={max}
          maxLength={maxLength}
          minLength={minLength}
          min={min}
          pattern={pattern}
        />
      </label>
    );
  },
);
