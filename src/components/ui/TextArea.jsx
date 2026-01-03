import React from 'react';
import clsx from 'clsx';

const TextArea = ({ className, ...props }) => {
  return (
    <textarea
      className={clsx(
        'w-full px-4 py-2 rounded-lg border border-warm-sand focus:border-love-300 focus:ring-2 focus:ring-love-100 outline-none bg-white/50 backdrop-blur-sm transition-all min-h-[100px]',
        className
      )}
      {...props}
    />
  );
};

export default TextArea;
