export interface List {
  id: string;
  name: string;
  icon?: string;
  items: ListItem[];
  favorite?: boolean;
}

export interface ListItem {
  itemId: string;
  completed: boolean;
}

export interface Item {
  id: string;
  name: string;
  tags: ItemTag[];
  [key: string]: unknown;
}

export interface ItemTag {
  id: string;
  name: string;
  icon?: string;
}

export enum Sorting {
  ADDED_ASC = "ADDED_ASC",
  ADDED_DESC = "ADDED_DESC",
  ALPHA_ASC = "ALPHA_ASC",
  ALPHA_DESC = "ALPHA_DESC",
}
