import React from 'react';
import clsx from 'clsx';

const Button = ({ children, variant = 'primary', className, ...props }) => {
  const variants = {
    primary: 'bg-love-500 text-white hover:bg-love-600 shadow-sm',
    secondary: 'bg-white text-love-600 border border-love-200 hover:bg-love-50',
    ghost: 'text-love-600 hover:bg-love-50',
  };

  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-full font-medium transition-colors duration-200 flex items-center justify-center gap-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
