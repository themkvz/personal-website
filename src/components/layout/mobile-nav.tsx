import { Drawer } from "@base-ui/react/drawer";
import { ChevronRight, Menu } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";
import { Button } from "~/components/ui/button";
import { Nav as NavData } from "~/constants";
import { cn } from "~/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger
        render={
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        }
      />
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 min-h-dvh bg-black/40 opacity-[calc(1-var(--drawer-swipe-progress))] transition-opacity duration-300 data-swiping:duration-0 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Drawer.Viewport className="fixed inset-0 flex items-end justify-center">
          <Drawer.Popup className="max-h-[80dvh] w-full overflow-y-auto overscroll-contain rounded-t-lg border-t border-border bg-popover px-6 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] text-popover-foreground shadow-md outline-none [transform:translateY(var(--drawer-swipe-movement-y))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:[transform:translateY(100%)] data-starting-style:[transform:translateY(100%)] data-swiping:select-none">
            <div
              aria-hidden="true"
              className="mx-auto mb-4 h-1 w-12 rounded-full bg-border"
            />
            <Drawer.Content>
              <Drawer.Title className="sr-only">Menu</Drawer.Title>
              <nav aria-label="Primary" className="flex flex-col">
                {NavData.links.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "t-label flex items-center justify-between border-b border-border py-4 last:border-b-0",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )
                    }
                  >
                    {label}
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </NavLink>
                ))}
              </nav>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
