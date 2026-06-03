import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <h1 className={"border-b pb-4"}>Packing planner</h1>
      <Outlet />
    </React.Fragment>
  );
}
