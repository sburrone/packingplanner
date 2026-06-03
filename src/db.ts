import { createCollection } from "@tanstack/react-db";
import { localStorageCollectionOptions } from "@tanstack/react-db";
import { z } from "zod";

const listsSchema = z.object({
  id: z.string(),
  name: z.string(),
  items: z.array(z.object({ name: z.string(), checked: z.boolean() })),
});

export const listCollection = createCollection(
  localStorageCollectionOptions({
    id: "packingplanner-lists",
    storageKey: "packingplanner-lists",
    getKey: (item) => item.id,
    schema: listsSchema,
  }),
);
