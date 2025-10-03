import React from 'react';

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, options, onChange }) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);
