import { forwardRef, type ButtonHTMLAttributes } from "react";
import {
  buttonVariants,
  type ButtonVariant,
} from "@/_components/core/config/variants";
import type { ComponentSize } from "@/_components/core/types";

export type { ButtonVariant };

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ComponentSize;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      className,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonVariants({ variant, size, fullWidth, className })}
        {...props}
      />
    );
  },
);

/** @deprecated Use `<Button variant="accent" />` */
export const AccentButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant">
>(function AccentButton(props, ref) {
  return <Button ref={ref} variant="accent" {...props} />;
});

export function buttonClassName(
  options: Parameters<typeof buttonVariants>[0],
) {
  return buttonVariants(options);
}
