import type { ButtonHTMLAttributes } from 'react';

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'secondary';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export function buttonVariants({
  variant = 'default',
  size = 'default',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  const base =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue/30 disabled:pointer-events-none disabled:opacity-50';

  const variants: Record<ButtonVariant, string> = {
    default: 'bg-[#202124] text-white hover:bg-black shadow-sm hover:shadow-md',
    secondary: 'bg-[#E8F0FE] text-google-blue hover:bg-[#dbe7ff]',
    outline: 'border border-[#DADCE0] text-google-blue bg-white hover:bg-[#F1F3F4]',
    ghost: 'text-google-gray hover:bg-[#F1F3F4]',
  };

  const sizes: Record<ButtonSize, string> = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-11 rounded-md px-6 text-sm',
    icon: 'h-10 w-10',
  };

  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return <button className={buttonVariants({ variant, size, className })} {...props} />;
}
