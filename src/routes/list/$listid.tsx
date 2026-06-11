import { createFileRoute, useLocation } from "@tanstack/react-router";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { itemCollection, listCollection } from "@/src/db";
import { Checkbox } from "@/components/ui/checkbox";
import { Item, List, ListItem, Sorting } from "@/src/types";
import Combobox from "@/src/components/Combobox";
import { v6 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import SortingSelector from "@/src/components/SortingSelector";
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { Fade, Slide } from "@mui/material";

export const Route = createFileRoute("/list/$listid")({
  component: RouteComponent,
});

function RouteComponent() {
  const [sorting, setSorting] = useState<Sorting>(Sorting.ADDED_ASC);
  const [completedFirst, setCompletedFirst] = useState<boolean>(true);

  const location = useLocation();
  const { listid } = Route.useParams();

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
    itemCollection.insert(item);
    listCollection.update(listid, (l) => {
      const list = l as unknown as List;
      list.items.push({ itemId: item.id, completed: false });
    });
  };

  if (!currentList) return;

  const itemsCompleted = currentList.items.filter((item) => item.completed);
  const itemsToComplete = currentList.items.filter((item) => !item.completed);

  const itemRenderer = (_li: ListItem) => {
    const item = itemCollection.get(_li.itemId) as Item;
    if (!item) return;
    return (
      <div key={item.id} className={"flex flex-row gap-3 items-center w-80"}>
        <Checkbox checked={_li.completed} onCheckedChange={(checked) => handleCheck(item.id, checked === true)} />
        <span className={`text-main-foreground ${_li.completed && "line-through"}`}>{item.name}</span>
      </div>
    );
  };

  return (
    <>
      <div className={"flex flex-col gap-2 items-center w-96 max-w-dvw justify-center px-4 mx-auto"}>
        <h2>{currentList.name}</h2>

        <div className={"flex flex-row justify-between w-full"}>
          <Button className="bg-chart-2">
            <RotateCcw /> Reset
          </Button>

          <SortingSelector sorting={sorting} onChange={setSorting} completedFirst={completedFirst} setCompletedFirst={setCompletedFirst} />
        </div>

        <Combobox options={itemOptions as Item[]} createOption={(name) => ({ id: uuid(), name, tags: [] })} onAdd={handleAdd} />

        {completedFirst ? (
          <>
            <Accordion type={"multiple"} className={"w-full flex flex-col gap-2"} defaultValue={["completed", "toComplete"]}>
              <Slide direction={"right"} in={!!itemsToComplete.length} unmountOnExit={true}>
                <AccordionItem value={"toComplete"}>
                  <AccordionTrigger className={"h-10"}>Da completare ({itemsToComplete.length})</AccordionTrigger>
                  <AccordionContent className={"flex flex-col gap-4 bg-main p-4 pt-2 pb-2"}>{itemsToComplete.map(itemRenderer)}</AccordionContent>
                </AccordionItem>
              </Slide>
              <Slide direction={"right"} in={!!itemsCompleted.length} unmountOnExit={true}>
                <AccordionItem value={"completed"}>
                  <AccordionTrigger className={"h-10"}>Completati ({itemsCompleted.length})</AccordionTrigger>
                  <AccordionContent className={"flex flex-col gap-4 bg-main p-4 pt-2 pb-2"}>{itemsCompleted.map(itemRenderer)}</AccordionContent>
                </AccordionItem>
              </Slide>
            </Accordion>
          </>
        ) : (
          <div className={"flex flex-col gap-4 bg-main p-4 pt-2 pb-2"}>{currentList.items.map(itemRenderer)}</div>
        )}
      </div>
    </>
  );
}
