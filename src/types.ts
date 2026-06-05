export interface List {
  id: string;
  name: string;
  icon?: string;
  items: ListItem[];
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
