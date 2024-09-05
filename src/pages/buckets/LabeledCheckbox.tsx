import { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface LabeledCheckboxProps extends UseFormRegisterReturn {
  label: string;
}

export const LabeledCheckbox = forwardRef<HTMLInputElement, LabeledCheckboxProps>(
  ({ label, name, onBlur, onChange, disabled, required }, ref) => {
    return (
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">{label}</span>
          <input
            ref={ref}
            type="checkbox"
            className="checkbox"
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
          />
        </label>
      </div>
    );
  },
);
