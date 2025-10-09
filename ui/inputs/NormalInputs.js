"use client";
import React from "react";

const InputField = ({
  label,
  type = "text",
  placeholder = "",
  value,
  setValue,
  onChange,
  name,
  required = false,
  className = "",
  options = [],
  ...props
}) => {
 
  const handleChange = (e) => {
    if (setValue) setValue(e.target.value); 
    if (onChange) onChange(e);               
  };

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
          {...props}
        >
          <option value="">Select...</option>
          {options.map((item, i) => (
            <option key={i} value={item}>
              {item}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required={required}
          className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

export default InputField;
