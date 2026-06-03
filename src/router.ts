import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/src/routeTree.gen";

export const router = createRouter({
  routeTree,
});
