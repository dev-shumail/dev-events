// components/FormInput.tsx
import React, { FC, ChangeEvent } from "react";

interface FormInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  id: string;
  name?: string;
  required?: boolean;
  className?: string; // optional extra classes
}

const FormInput: FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type,
  id,
  name,
  required = false,
  className = "",
}) => {
  return (
    <div className="group">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-white/90 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name || id}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`block w-full px-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-200 ${className}`}
        />
      </div>
    </div>
  );
};

export default FormInput;
