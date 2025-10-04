const Input = React.forwardRef(({
  label,
  error,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const baseStyles = `
    w-full
    bg-white/5
    border border-white/10
    rounded-lg px-4 py-2
    text-white
    placeholder:text-gray-500
    focus:outline-none focus:ring-2
    focus:ring-indigo-500/50
    focus:border-transparent
    transition-all duration-200
  `;

  const errorStyles = error ? 
    'border-red-500/50 focus:ring-red-500/50' : '';

  const classes = [
    baseStyles,
    errorStyles,
    className
  ].join(' ');

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-400">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={classes}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Export to window object
window.Input = Input;

console.log('Input component loaded');
