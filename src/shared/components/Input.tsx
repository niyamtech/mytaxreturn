import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ 
  label, 
  error, 
  helperText, 
  className = '', 
  ...props 
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        className={`
          w-full rounded-lg border px-4 py-2.5 text-slate-900 
          transition-colors placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
          ${error 
            ? 'border-red-300 focus:ring-red-500' 
            : 'border-slate-300 hover:border-slate-400'
          }
          ${className}
        `}
        {...props}
      />
      
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>}
    </div>
  );
}