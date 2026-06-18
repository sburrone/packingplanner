import { ChangeEventHandler, useMemo, useState } from "react";
import { Item, ItemTag, List, ListItem, Sorting } from "@/src/types";
import { itemCollection, listCollection, tagCollection } from "@/src/db";
import { eq, useLiveQuery, WithVirtualProps } from "@tanstack/react-db";
import _ from "lodash";
import { useNavigate } from "@tanstack/react-router";
import { ColorModel, ColorPaletteGenerator } from "@martinlaxenaire/color-palette-generator";

export const useListUtils = ({ listid }: { listid: string }) => {
  const [sorting, setSorting] = useState<Sorting>((localStorage.getItem("packingplanner-settings-sorting") as Sorting) ?? Sorting.ADDED_ASC);
  const [groupCompleted, setGroupCompleted] = useState<boolean>(localStorage.getItem("packingplanner-settings-groupcompleted") !== "false");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const { data: currentList } = useLiveQuery((q) =>
    q
      .from({ pref: listCollection })
      .where(({ pref: list }) => eq(list.id, listid))
      .findOne(),
  );

  const { data: itemOptions } = useLiveQuery((q) => q.from({ pref: itemCollection }));
  const { data: allTags } = useLiveQuery((q) => q.from({ pref: tagCollection }));

  const handleCheck = (id: string, completed: boolean) => {
    listCollection.update(listid, (l) => {
      const list = l as unknown as List;
      const item = list.items.find((item) => item.itemId === id);

      if (!item) return;

      item.completed = completed;
    });
  };

  const handleAdd = (item: Item) => {
    if (!itemCollection.has(item.id)) itemCollection.insert(item);
    listCollection.update(listid, (l) => {
      const list = l as unknown as List;
      list.items.push({ itemId: item.id, completed: false });
    });
  };

  const handleDeleteItem = (id: string) => {
    listCollection.update(listid, (l) => {
      const list = l as unknown as List;
      _.remove(list.items, (el) => el.itemId === id);
    });
  };

  const handleSortingChange = (sorting: Sorting) => {
    setSorting(sorting);
    localStorage.setItem("packingplanner-settings-sorting", sorting);
  };

  const handleGroupCompletedChange = (groupCompleted: boolean) => {
    setGroupCompleted(groupCompleted);
    localStorage.setItem("packingplanner-settings-groupcompleted", String(groupCompleted));
  };

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const fullList = useMemo(() => {
    const mappedItems =
      currentList?.items.map((el) => ({ full: itemCollection.get(el.itemId), listItem: el })).filter((el): el is { full: WithVirtualProps<Item, string>; listItem: ListItem } => !!el.full) ?? [];

    const tagReducer = (acc: ListItem[], cur: ItemTag) => {
      mappedItems
        .filter((i) => i.full.tags.find((t) => t.id === cur.id))
        .forEach((itemWithCurrentTag) => {
          if (!acc.find((i) => i.itemId === itemWithCurrentTag.full.id)) {
            acc.push(itemWithCurrentTag.listItem);
          }
        });
      return acc;
    };

    switch (sorting) {
      case Sorting.ADDED_ASC:
      default:
        return currentList?.items ?? [];
      case Sorting.ADDED_DESC:
        return currentList?.items.toReversed() ?? [];
      case Sorting.ALPHA_ASC:
        return (
          currentList?.items.toSorted((a, b) => {
            const mappedA = itemCollection.get(a.itemId);
            const mappedB = itemCollection.get(b.itemId);
            return mappedA?.name.localeCompare(mappedB?.name ?? "") ?? 0;
          }) ?? []
        );
      case Sorting.ALPHA_DESC:
        return (
          currentList?.items.toSorted((a, b) => {
            const mappedA = itemCollection.get(a.itemId);
            const mappedB = itemCollection.get(b.itemId);
            return mappedB?.name.localeCompare(mappedA?.name ?? "") ?? 0;
          }) ?? []
        );
      case Sorting.TAGS_ASC:
        return allTags.toSorted((a, b) => a.name.localeCompare(b.name)).reduce(tagReducer, [] as ListItem[]) ?? [];
      case Sorting.TAGS_DESC:
        return allTags.toSorted((a, b) => b.name.localeCompare(a.name)).reduce(tagReducer, [] as ListItem[]) ?? [];
    }
  }, [currentList?.items, sorting]);

  const colorPalette = useMemo(() => {
    const generator = new ColorPaletteGenerator({
      precision: 10,
      baseColor: "red",
      hueRange: 360,
    });
    const tags = _.uniqBy(
      itemOptions.flatMap((item) => item.tags),
      "id",
    );
    const palette = generator.getRandomPalette({ length: tags.length, includeBaseColor: false, minBrightness: 40, maxSaturation: 80 });

    return tags.reduce(
      (acc, cur, index) => {
        acc[cur.id] = palette[index];
        return acc;
      },
      {} as Record<string, ColorModel>,
    );
  }, [itemOptions]);

  const { data: allItems } = useLiveQuery((q) => q.from({ pref: itemCollection }));
  const itemsInList = allItems.filter((item) => fullList.find((li) => li.itemId === item.id));
  const itemTagsInList = _.uniqBy(
    itemsInList.flatMap((item) => item.tags),
    (tag) => tag.id,
  );

  const fullListFilteredByTags = useMemo(() => {
    const itemsInListFilteredByTags = itemsInList.filter((item) => !selectedTagIds.length || item.tags.find((tag) => selectedTagIds.includes(tag.id)));
    return fullList.filter((li) => itemsInListFilteredByTags.find((i) => li.itemId === i.id));
  }, [fullList, itemTagsInList]);

  const itemsCompleted = fullListFilteredByTags.filter((item) => item.completed) ?? [];
  const itemsToComplete = fullListFilteredByTags.filter((item) => !item.completed) ?? [];

  const [listNameInput, setListNameInput] = useState<string>(currentList?.name ?? "");
  const handleListNameInputChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (e) => {
    setListNameInput((e.target as HTMLInputElement).value);
  };

  const handleListNameChange = () => {
    listCollection.update(listid, (l) => {
      const list = l as unknown as List;
      list.name = listNameInput;
    });
  };

  const toggleEditing = () => {
    if (!isEditing) setIsEditing(true);
    else {
      setIsEditing(false);
      if (currentList?.name && currentList.name !== listNameInput) {
        handleListNameChange();
      }
    }
  };

  const batchReset = (val?: boolean) => {
    if (!isEditing) return;

    listCollection.update(listid, (l) => {
      const list = l as unknown as List;
      list.items.forEach((item) => {
        item.completed = val ?? false;
      });
    });
  };

  const deleteList = async () => {
    listCollection.delete(listid);
    await navigate({ to: "/" });
  };

  return {
    sorting,
    handleSortingChange,
    groupCompleted,
    handleGroupCompletedChange,
    itemOptions,
    handleCheck,
    handleAdd,
    currentList,
    fullList,
    itemsCompleted,
    itemsToComplete,
    isEditing,
    listNameInput,
    handleListNameInputChange,
    toggleEditing,
    handleDeleteItem,
    batchReset,
    deleteList,
    itemTagsInList,
    selectedTagIds,
    setSelectedTagIds,
    fullListFilteredByTags,
    colorPalette,
  };
};
