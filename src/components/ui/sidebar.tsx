"use client";

import * as React from "react";

type SidebarContextValue = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

type SidebarProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
};

function SidebarProvider({
  defaultOpen = true,
  className,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(defaultOpen);
  const [openMobile, setOpenMobile] = React.useState(false);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
      return;
    }
    setOpen((prev) => !prev);
  }, [isMobile]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar]);

  const state: "expanded" | "collapsed" = open ? "expanded" : "collapsed";

  const value = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }),
    [state, open, openMobile, isMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div className={className} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

type SidebarProps = React.ComponentProps<"aside"> & {
  side?: "left" | "right";
  collapsible?: "offcanvas" | "icon" | "none";
};

function Sidebar({
  side = "left",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: SidebarProps) {
  const { isMobile, open, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <>
        {openMobile && (
          <>
            <button
              type="button"
              aria-label="Close sidebar overlay"
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setOpenMobile(false)}
            />
            <aside
              className={`fixed top-0 ${side === "left" ? "left-0" : "right-0"} z-50 h-svh w-72 overflow-y-auto border-r border-bordeaux-900/10 bg-white p-4 shadow-xl`}
              {...props}
            >
              {children}
            </aside>
          </>
        )}
      </>
    );
  }

  if (collapsible === "none") {
    return (
      <aside className={className} {...props}>
        {children}
      </aside>
    );
  }

  return (
    <aside
      data-state={open ? "expanded" : "collapsed"}
      data-collapsible={open ? "" : collapsible}
      className={`${open ? "w-72" : collapsible === "icon" ? "w-14" : "w-0"} relative overflow-hidden border-r border-bordeaux-900/10 bg-white transition-[width] duration-200 ease-linear ${className ?? ""}`}
      {...props}
    >
      <div className={`${open ? "opacity-100" : collapsible === "icon" ? "opacity-100" : "opacity-0"} h-full transition-opacity`}>
        {children}
      </div>
    </aside>
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return <main className={`min-w-0 flex-1 ${className ?? ""}`} {...props} />;
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={`mb-4 ${className ?? ""}`} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={`min-h-0 flex-1 overflow-y-auto ${className ?? ""}`}
      {...props}
    />
  );
}

function SidebarTrigger({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-bordeaux-900/15 bg-white text-bordeaux-900 transition-colors hover:bg-beige-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className ?? ""}`}
      {...props}
    >
      <span aria-hidden="true">☰</span>
      <span className="sr-only">Sidebar umschalten</span>
    </button>
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="sidebar-group" className={`px-2 py-1 ${className ?? ""}`} {...props} />
  );
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="sidebar-group-label"
      className={`px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary ${className ?? ""}`}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group-content" className={className} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="sidebar-menu" className={`space-y-1 ${className ?? ""}`} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-item" className={className} {...props} />;
}

type SidebarMenuButtonProps = React.ComponentProps<"a"> & {
  isActive?: boolean;
  size?: "default" | "sm" | "lg";
  tooltip?: string;
};

function SidebarMenuButton({
  isActive = false,
  size = "default",
  tooltip,
  className,
  ...props
}: SidebarMenuButtonProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const sizeClass =
    size === "sm" ? "h-7 text-xs" : size === "lg" ? "h-10 text-sm" : "h-8 text-sm";

  return (
    <a
      data-slot="sidebar-menu-button"
      data-active={isActive}
      title={collapsed ? tooltip : undefined}
      aria-label={collapsed ? tooltip : props["aria-label"]}
      className={[
        "flex w-full items-center gap-2 overflow-hidden rounded-md px-3 transition-colors",
        sizeClass,
        isActive
          ? "bg-bordeaux-900 text-white"
          : "text-text-secondary hover:bg-bordeaux-900/5 hover:text-text-primary",
        collapsed ? "justify-center px-2" : "",
        className ?? "",
      ].join(" ")}
      {...props}
    />
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      aria-label="Sidebar umschalten"
      onClick={toggleSidebar}
      className={`absolute top-1/2 -right-2 hidden h-14 w-2 -translate-y-1/2 rounded-full border border-bordeaux-900/20 bg-white/95 transition-colors hover:bg-beige-50 lg:block ${className ?? ""}`}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
};
