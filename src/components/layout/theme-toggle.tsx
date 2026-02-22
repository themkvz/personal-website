import { Monitor, Moon, Sun } from "lucide-react";
import type { Theme } from "~/lib/theme";
import { useThemeStore } from "~/store/theme";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPositioner,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const options: { value: Theme; label: string; icon: React.ElementType }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const CurrentIcon =
    theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Toggle theme">
            <CurrentIcon className="h-5 w-5" />
          </Button>
        }
      />
      <DropdownMenuPositioner align="end">
        <DropdownMenuContent>
          {options.map(({ value, label, icon: Icon }) => (
            <DropdownMenuItem
              key={value}
              onClick={() => setTheme(value)}
              className={theme === value ? "bg-accent" : ""}
            >
              <Icon className="h-4 w-4" />
              <span className="ml-2">{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuPositioner>
    </DropdownMenu>
  );
}
