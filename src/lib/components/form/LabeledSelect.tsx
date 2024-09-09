import { IconInfo } from '@/lib/components/icons/IconInfo';
import { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface LabeledSelectProps extends UseFormRegisterReturn {
  label: string;
  labelAlt?: React.ReactNode;
  tooltip?: string;

  options: { label: string; value: string }[];
}

export const LabeledSelect = forwardRef<HTMLSelectElement, LabeledSelectProps>(
  (
    {
      label,
      tooltip,
      labelAlt,
      options,

      name,
      onBlur,
      onChange,
      disabled,
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
        <select
          className="select select-bordered"
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          name={name}
          disabled={disabled}
        >
          {options.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {labelAlt && (
          <div className="label">
            <span className="label-text-alt">{labelAlt}</span>
          </div>
        )}
      </label>
    );
  },
);
