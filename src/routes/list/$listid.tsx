import { createFileRoute, Link } from "@tanstack/react-router";
import { itemCollection } from "@/src/db";
import { Checkbox } from "@/components/ui/checkbox";
import { Item, ListItem } from "@/src/types";
import Combobox from "@/src/components/Combobox";
import { v6 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { Check, Home, Pencil, RotateCcw, Trash } from "lucide-react";
import SortingSelector from "@/src/components/SortingSelector";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slide } from "@mui/material";
import { Label } from "@/components/ui/label";
import { useListUtils } from "@/src/hooks/useListUtils";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/src/components/PageHeader";
import ListToolbar from "@/src/routes/list/ListToolbar";
import ListItemElement from "@/src/routes/list/ListItemElement";

export const Route = createFileRoute("/list/$listid")({
  component: RouteComponent,
});

function RouteComponent() {
  const { listid } = Route.useParams();

  const {
    handleGroupCompletedChange,
    handleSortingChange,
    sorting,
    groupCompleted,
    handleCheck,
    handleAdd,
    itemOptions,
    currentList,
    fullList,
    itemsCompleted,
    itemsToComplete,
    listNameInput,
    handleListNameInputChange,
    isEditing,
    toggleEditing,
    handleDeleteItem,
  } = useListUtils({
    listid,
  });

  if (!currentList) return;

  return (
    <>
      <PageHeader
        title={
          isEditing ? (
            <div className={"flex flex-row w-96 mx-auto px-4"}>
              <Input className={"text-xl font-sans bg-foreground text-main-foreground flex-1 w-full h-9"} aria-label={"Rinomina lista"} value={listNameInput} onChange={handleListNameInputChange} />
            </div>
          ) : (
            currentList.name
          )
        }
      />

      <div className={"flex flex-col gap-2 items-center w-96 max-w-dvw justify-center px-4 mx-auto"}>
        <ListToolbar
          isEditing={isEditing}
          toggleEditing={toggleEditing}
          handleSortingChange={handleSortingChange}
          sorting={sorting}
          handleGroupCompletedChange={handleGroupCompletedChange}
          groupCompleted={groupCompleted}
        />

        {!isEditing && <Combobox options={itemOptions as Item[]} createOption={(name) => ({ id: uuid(), name, tags: [] })} onAdd={handleAdd} />}

        {groupCompleted ? (
          <>
            <Accordion type={"multiple"} className={"w-full flex flex-col gap-2"} defaultValue={["completed", "toComplete"]}>
              <Slide direction={"right"} in={!!itemsToComplete.length} unmountOnExit={true}>
                <AccordionItem value={"toComplete"}>
                  <AccordionTrigger className={"h-10"}>Da completare ({itemsToComplete.length})</AccordionTrigger>
                  <AccordionContent className={"flex flex-col gap-4 bg-main p-4 pt-2 pb-2"}>
                    {itemsToComplete.map((li) => (
                      <ListItemElement key={li.itemId} listItem={li} isEditing={isEditing} handleCheck={handleCheck} handleDeleteItem={handleDeleteItem} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Slide>
              <Slide direction={"right"} in={!!itemsCompleted.length} unmountOnExit={true}>
                <AccordionItem value={"completed"}>
                  <AccordionTrigger className={"h-10"}>Completati ({itemsCompleted.length})</AccordionTrigger>
                  <AccordionContent className={"flex flex-col gap-4 bg-main p-4 pt-2 pb-2"}>
                    {itemsCompleted.map((li) => (
                      <ListItemElement key={li.itemId} listItem={li} isEditing={isEditing} handleCheck={handleCheck} handleDeleteItem={handleDeleteItem} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Slide>
            </Accordion>
          </>
        ) : (
          <div className={"flex flex-col gap-4 bg-main p-4 pt-2 pb-2"}>
            {fullList.map((li) => (
              <ListItemElement key={li.itemId} listItem={li} isEditing={isEditing} handleCheck={handleCheck} handleDeleteItem={handleDeleteItem} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
