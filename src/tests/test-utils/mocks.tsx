import { vi } from "vitest";
import type { PropsWithChildren } from "react";

export function mockNextIntl() {
  vi.mock("next-intl", () => ({
    NextIntlClientProvider: ({ children }: PropsWithChildren) => <>{children}</>,
    useTranslations: () => (key: string) => key,
    useLocale: () => "de",
  }));
}

export function mockNextIntlServer() {
  vi.mock("next-intl/server", () => ({
    getMessages: async () => ({}),
    getTranslations: async () => (key: string) => key,
    setRequestLocale: () => {},
    getLocale: async () => "de",
  }));
}

export function mockMotionReact() {
  vi.mock("motion/react", () => {
    function filterDomProps(props: Record<string, unknown>) {
      const blocked = new Set([
        "initial",
        "animate",
        "exit",
        "transition",
        "variants",
        "whileHover",
        "whileTap",
        "whileInView",
        "viewport",
        "layout",
        "custom",
        "style",
      ]);
      const filtered: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (!blocked.has(k)) filtered[k] = v;
      }
      return filtered;
    }

    return {
      motion: new Proxy({} as Record<string, unknown>, {
        get: (_target, prop: string) => {
          const Comp = ({
            children,
            ...rest
          }: PropsWithChildren<Record<string, unknown>>) => {
            const tag = typeof prop === "string" && ["svg", "path", "div", "span", "p"].includes(prop)
              ? prop
              : "div";
            const Tag = tag as keyof JSX.IntrinsicElements;
            return (
              <Tag data-motion-element={prop} {...filterDomProps(rest)}>
                {children}
              </Tag>
            );
          };
          Comp.displayName = `motion.${prop}`;
          return Comp;
        },
      }),
      AnimatePresence: ({ children }: PropsWithChildren) => <>{children}</>,
      useReducedMotion: () => false,
      useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
      useTransform: () => 0,
      useInView: () => true,
      useMotionValue: (initial: number) => ({
        get: () => initial,
        set: () => {},
        on: () => () => {},
      }),
      useSpring: (val: unknown) => val,
      animate: (_motionValue: unknown, _to: unknown, _opts?: unknown) => ({
        stop: () => {},
      }),
    };
  });
}

export function mockNextImage() {
  vi.mock("next/image", () => ({
    default: ({ priority: _priority, fill: _fill, ...rest }: Record<string, unknown>) => {
      // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
      return <img {...rest} />;
    },
  }));
}

export function mockNavigation() {
  vi.mock("@/i18n/navigation", () => ({
    Link: ({
      children,
      href,
      ...rest
    }: PropsWithChildren<{ href: string } & Record<string, unknown>>) => {
      const { locale: _locale, prefetch: _prefetch, ...domProps } = rest as Record<string, unknown>;
      return (
        <a href={href} {...domProps}>
          {children}
        </a>
      );
    },
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => "/de",
  }));
}
