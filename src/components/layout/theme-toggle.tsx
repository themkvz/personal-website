import { Monitor, Moon, Sun } from "lucide-react";
import { type Theme, useThemeStore } from "../../store/theme";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPositioner,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
  { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
];

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const currentIcon =
    theme === "dark" ? (
      <Moon className="h-5 w-5" />
    ) : theme === "light" ? (
      <Sun className="h-5 w-5" />
    ) : (
      <Monitor className="h-5 w-5" />
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Toggle theme">
            {currentIcon}
          </Button>
        }
      />
      <DropdownMenuPositioner align="end">
        <DropdownMenuContent>
          {themes.map(({ value, label, icon }) => (
            <DropdownMenuItem
              key={value}
              onClick={() => setTheme(value)}
              className={theme === value ? "bg-accent" : ""}
            >
              {icon}
              <span className="ml-2">{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuPositioner>
    </DropdownMenu>
  );
}
