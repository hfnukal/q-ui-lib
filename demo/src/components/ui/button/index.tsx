// src/components/button/index.tsx
import { component$, PropFunction } from '@builder.io/qwik';

export interface ButtonProps {
  /** Text displayed on the button */
  label: string;
  /** Click handler */
  onClick$?: PropFunction<() => void>;
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Premium Button component with smooth hover animation, gradient background for primary variant,
 * and accessible focus outline. Designed to be reusable across Qwik applications.
 */
export const Button = component$<ButtonProps>((props) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md px-5 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-500 shadow-md',
  }[props.variant ?? 'primary'];

  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type="button"
      class={`${baseClasses} ${variantClasses} ${disabledClasses}`}
      onClick$={props.onClick$}
      disabled={props.disabled}
    >
      {props.label}
    </button>
  );
});
