import { ChangeEventHandler, useState } from "react";
import { Item, List, Sorting } from "@/src/types";
import { itemCollection, listCollection } from "@/src/db";
import { eq, useLiveQuery } from "@tanstack/react-db";
import _ from "lodash";

export const useListUtils = ({ listid }: { listid: string }) => {
  const [sorting, setSorting] = useState<Sorting>((localStorage.getItem("packingplanner-settings-sorting") as Sorting) ?? Sorting.ADDED_ASC);
  const [groupCompleted, setGroupCompleted] = useState<boolean>(localStorage.getItem("packingplanner-settings-groupcompleted") !== "false");
  const [isEditing, setIsEditing] = useState(false);

  const { data: currentList } = useLiveQuery((q) =>
    q
      .from({ pref: listCollection })
      .where(({ pref: list }) => eq(list.id, listid))
      .findOne(),
  );

  const { data: itemOptions } = useLiveQuery((q) => q.from({ pref: itemCollection }));

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

  const fullList = currentList?.items ?? [];
  const itemsCompleted = currentList?.items.filter((item) => item.completed) ?? [];
  const itemsToComplete = currentList?.items.filter((item) => !item.completed) ?? [];

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

  const deleteList = () => {
    listCollection.delete(listid);
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
  };
};
