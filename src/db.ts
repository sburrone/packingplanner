import { createCollection, localStorageCollectionOptions } from "@tanstack/react-db";
import { z } from "zod";
import { List, ListItem, Item, ItemTag } from "@/src/types";

const listItemSchema: z.ZodType<ListItem> = z.object({
  itemId: z.string(),
  completed: z.boolean().default(false),
});

const listsSchema: z.ZodType<List> = z.object({
  id: z.string(),
  name: z.string(),
  items: z.array(listItemSchema),
  favorite: z.boolean().default(false),
  icon: z.string().optional(),
}) satisfies z.ZodType<List>;

export const listCollection = createCollection(
  localStorageCollectionOptions({
    id: "packingplanner-lists",
    storageKey: "packingplanner-lists",
    getKey: (item) => item.id,
    schema: listsSchema,
  }),
);

const itemTagSchema: z.ZodType<ItemTag> = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
});

const itemSchema: z.ZodType<Item> = z.object({
  id: z.string(),
  name: z.string(),
  tags: z.array(itemTagSchema),
});

export const itemCollection = createCollection(
  localStorageCollectionOptions({
    id: "packingplanner-items",
    storageKey: "packingplanner-items",
    getKey: (item) => item.id,
    schema: itemSchema,
  }),
);

export const tagCollection = createCollection(
  localStorageCollectionOptions({
    id: "packingplanner-tags",
    storageKey: "packingplanner-tags",
    getKey: (item) => item.id,
    schema: itemTagSchema,
  }),
);
