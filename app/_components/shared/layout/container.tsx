import { cn } from "@/lib/utils";

export interface ContainerProps {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "main" | "header" | "footer" | "article";
}

export function Container({
  className,
  children,
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component className={cn("container-page", className)}>
      {children}
    </Component>
  );
}

export interface SectionProps {
  className?: string;
  children: React.ReactNode;
  id?: string;
  /** Skip inner Container wrapper when true */
  bare?: boolean;
}

export function Section({
  className,
  children,
  id,
  bare = false,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      {bare ? children : <Container>{children}</Container>}
    </section>
  );
}
