import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/src/router";

function App() {
  return (
    <ThemeProvider defaultTheme={"system"} storageKey={"packingplanner-theme"}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
