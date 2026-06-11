import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <div className={"pb-1 pt-2 border-b-4 mb-4 bg-main-foreground"}>
        <h2 className={"text-main"}>Packing planner</h2>
      </div>
      <Outlet />
    </React.Fragment>
  );
}
