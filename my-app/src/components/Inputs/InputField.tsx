import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ label, type, name, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input type={type} id={name} name={name} value={value} onChange={onChange} required />
  </div>
);
