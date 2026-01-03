import React from 'react';
import clsx from 'clsx';

const Input = ({ className, ...props }) => {
  return (
    <input
      className={clsx(
        'w-full px-4 py-2 rounded-lg border border-warm-sand focus:border-love-300 focus:ring-2 focus:ring-love-100 outline-none bg-white/50 backdrop-blur-sm transition-all',
        className
      )}
      {...props}
    />
  );
};

export default Input;
