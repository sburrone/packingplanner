import * as React from "react";
import { useEffect } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";
import { useMediaQuery } from "@base-ui/react/unstable-use-media-query";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)", {});
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setTheme(prefersDark ? "dark" : "light");
  }, [prefersDark]);

  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
}
