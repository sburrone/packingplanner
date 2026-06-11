import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <div className={"pb-1 pt-3 border-b-4 mb-4 bg-secondary-background"}>
        <h2>
          <span className={"text-main"}>V</span>aligiatore
        </h2>
      </div>
      <Outlet />
    </React.Fragment>
  );
}
