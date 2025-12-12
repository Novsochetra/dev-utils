import { CircleAlertIcon, CircleCheckIcon, TriangleAlertIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{ 
        warning: <TriangleAlertIcon className="w-4 h-4 text-amber-500" />,
        success: <CircleCheckIcon className="w-4 h-4 text-green-500" /> ,
        error: <CircleAlertIcon className="w-4 h-4 text-destructive" /> 
      }}
      
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          fontFamily: "var(--font-jetbrains-mono)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
