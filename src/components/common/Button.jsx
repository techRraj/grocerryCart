import { cn } from "../../utils/format";
export default function Button({ variant = "primary", className, children, ...rest }) {
  const styles = {
    primary: "btn-primary",
    ghost: "btn-ghost",
    outline: "border border-gray-200 bg-white hover:border-primary hover:text-primary font-medium rounded-xl px-4 py-2.5 transition",
    danger: "bg-error text-white font-semibold rounded-xl px-4 py-2.5 hover:bg-red-600 transition",
  };
  return <button className={cn(styles[variant], className)} {...rest}>{children}</button>;
}