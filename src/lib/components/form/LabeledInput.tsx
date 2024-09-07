import { IconInfo } from '@/lib/components/icons/IconInfo';
import { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface LabeledInputProps extends UseFormRegisterReturn {
  label: string;
  labelAlt?: React.ReactNode;
  tooltip?: string;
  type?: 'text' | 'number' | 'email' | 'password';
}

export const LabeledInput = forwardRef<HTMLInputElement, LabeledInputProps>(
  (
    {
      label,
      tooltip,
      type,
      labelAlt,

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
          className="input input-bordered disabled:bg-zinc-800 disabled:text-zinc-400"
          type={type}
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
        {labelAlt && (
          <div className="label">
            <span className="label-text-alt">{labelAlt}</span>
          </div>
        )}
      </label>
    );
  },
);
