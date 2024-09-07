import { IconInfo } from '@/lib/components/icons/IconInfo';
import { uniq } from '@/lib/util/uniq';
import { forwardRef, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { IconCross } from '../icons/IconCross';

export interface LabeledTagsInputProps extends Pick<UseFormRegisterReturn, 'disabled' | 'onBlur' | 'name'> {
  label: string;
  labelAlt?: React.ReactNode;
  tooltip?: string;

  onChange(tags: string[]): void;
  value: string[];
}

export const LabeledTagsInput = forwardRef<HTMLInputElement, LabeledTagsInputProps>(
  ({ label, tooltip, labelAlt, onBlur, onChange, disabled, name, value: valueFromProps }, ref) => {
    const value = valueFromProps ?? []; // sometimes hooked-form sends-in undefined...
    const [textFieldState, setTextFieldState] = useState('');
    console.log('value', value);
    return (
      <div>
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
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const newTags = e.currentTarget.value.split(',').map((tag) => tag.trim());
                const added = uniq([...value, ...newTags]);
                onChange(added);
                setTextFieldState('');
                e.preventDefault()
              }
            }}
            onChange={(e) => setTextFieldState(e.target.value)}
            value={textFieldState}
            onBlur={onBlur}
            name={name}
            disabled={disabled}
          />
          {labelAlt && (
            <div className="label">
              <span className="label-text-alt">{labelAlt}</span>
            </div>
          )}
        </label>
        <div className='flex flex-row flex-wrap mt-2 gap-0.5'>
          {value.map((tag) => {
            return (
              <div className="badge badge-neutral badge-lg relative pl-7" key={tag}>
                <button className='btn btn-xs btn-ghost btn-circle absolute left-0' onClick={_ => {
                  onChange(value.filter(t => t !== tag))
                }}> <IconCross /> </button>
                {tag}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
