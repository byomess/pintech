import { FC, useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

// Adjusted to explicitly include boolean and object types for value
export type OptionValueType = string | number | boolean | { [key: string]: any };

export type OptionType = {
  value: OptionValueType;
  label: string;
};

export type CustomSelectProps = {
  options: OptionType[];
  value: OptionValueType;
  size?: 'sm' | 'md' | 'lg';
  searchable?: boolean;
  className?: string;
  onChange: (value: OptionValueType) => void;
}

export const CustomSelect: FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  searchable = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isEqualValue = (optionValue: OptionValueType, value: OptionValueType): boolean => {
    if (typeof optionValue === 'object' && typeof value === 'object' && optionValue !== null && value !== null) {
      return JSON.stringify(optionValue) === JSON.stringify(value);
    }
    return optionValue === value;
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedLabel = () => {
    const selectedOption = options.find(option => isEqualValue(option.value, value));
    return selectedOption ? selectedOption.label : 'Select';
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const buttonClass = `${sizeClasses[size]} rounded-md bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md hover:from-green-300 hover:to-blue-400 transition duration-300 ease-in-out flex items-center justify-between w-full`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={clsx('relative', className)} ref={wrapperRef}>
      <button className={buttonClass} onClick={() => setIsOpen(!isOpen)}>
        {getSelectedLabel()}
        <svg className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg overflow-hidden">
          {searchable && (
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 text-sm text-gray-700"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
