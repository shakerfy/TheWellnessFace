import { useState, useEffect } from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme, type ThemeMode } from "@/lib/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function ThemeToggle({
  variant = "ghost",
  size = "sm",
  showLabel = false,
}: {
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "default" | "icon";
  showLabel?: boolean;
}) {
  const { theme, setTheme, effectiveTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className="rounded-xl font-bold text-xs gap-2 border-border/60 opacity-0 pointer-events-none"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="rounded-xl font-bold text-xs gap-2 border-border/60 hover:bg-secondary transition-all"
        >
          {effectiveTheme === "dark" ? (
            <Moon className="h-4 w-4 text-indigo-400 shrink-0" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500 shrink-0" />
          )}
          {showLabel && (
            <span className="capitalize">
              {theme === "system" ? "Sistema" : theme === "dark" ? "Oscuro (Rimu)" : "Claro"}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-2xl p-1.5 min-w-[150px] border-border bg-card shadow-xl"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`rounded-xl text-xs font-bold gap-2.5 cursor-pointer py-2 ${
            theme === "light" ? "bg-secondary text-foreground font-black" : "text-muted-foreground"
          }`}
        >
          <Sun className="h-4 w-4 text-amber-500" />
          <span>Modo Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`rounded-xl text-xs font-bold gap-2.5 cursor-pointer py-2 ${
            theme === "dark" ? "bg-secondary text-foreground font-black" : "text-muted-foreground"
          }`}
        >
          <Moon className="h-4 w-4 text-indigo-400" />
          <span>Modo Oscuro (Rimu)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`rounded-xl text-xs font-bold gap-2.5 cursor-pointer py-2 ${
            theme === "system" ? "bg-secondary text-foreground font-black" : "text-muted-foreground"
          }`}
        >
          <Laptop className="h-4 w-4 text-muted-foreground" />
          <span>Automático (Sistema)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
