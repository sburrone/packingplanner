import { useState } from "react";
import "./App.css";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/src/router";

function App() {
  return (
    <ThemeProvider defaultTheme={"system"} storageKey={"theme"}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
