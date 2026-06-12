import { createFileRoute, Link } from "@tanstack/react-router";
import { itemCollection } from "@/src/db";
import { Checkbox } from "@/components/ui/checkbox";
import { Item, ListItem } from "@/src/types";
import Combobox from "@/src/components/Combobox";
import { v6 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { Check, Home, Pencil, RotateCcw, Save, Trash } from "lucide-react";
import SortingSelector from "@/src/components/SortingSelector";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slide } from "@mui/material";
import { Label } from "@/components/ui/label";
import { useListUtils } from "@/src/hooks/useListUtils";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/src/components/PageHeader";

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

  const itemRenderer = (_li: ListItem) => {
    const item = itemCollection.get(_li.itemId) as Item;
    if (!item) return;

    if (isEditing)
      return (
        <div key={item.id} className={"flex flex-row gap-3 items-center w-80 h-5"}>
          <span className={"text-left text-main-foreground flex-1"}>{item.name}</span>
          <ButtonGroup>
            <Button className={"bg-chart-5 h-7 w-7"} variant="noShadow" disabled>
              <Pencil />
            </Button>
            <ButtonGroupSeparator />
            <Button className={"bg-chart-2 h-7 w-7"} variant="noShadow" onClick={() => handleDeleteItem(item.id)}>
              <Trash />
            </Button>
          </ButtonGroup>
        </div>
      );
    return (
      <div key={item.id} className={"flex flex-row gap-3 items-center w-80 h-5"}>
        <Checkbox
          className="transition-transform duration-200 ease-out data-[state=checked]:scale-110 data-[state=unchecked]:scale-100"
          id={item.id}
          checked={_li.completed}
          onCheckedChange={(checked) => handleCheck(item.id, checked === true)}
        />
        <Label htmlFor={item.id} className={"w-full text-left"}>
          <span
            className={`relative origin-left text-main-foreground after:absolute after:left-0 after:top-1/2 after:h-0.5 after:w-full after:-translate-y-1/2 after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out ${
              _li.completed ? "after:scale-x-100" : "after:scale-x-0"
            }`}
          >
            {item.name}
          </span>
        </Label>
      </div>
    );
  };

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
        <div className={"flex flex-row justify-between w-full mb-4"}>
          <ButtonGroup>
            <Link to={`/`}>
              <Button>
                <Home />
              </Button>
            </Link>
            <ButtonGroupSeparator />
            <Button className={isEditing ? "bg-chart-4" : undefined} onClick={toggleEditing}>
              {isEditing ? (
                <>
                  <Check />
                </>
              ) : (
                <>
                  <Pencil />
                </>
              )}
            </Button>
            {isEditing && (
              <>
                <ButtonGroupSeparator />
                <Button className="bg-chart-3">
                  <RotateCcw />
                </Button>
                <ButtonGroupSeparator />
                <Button className="bg-chart-2">
                  <Trash />
                </Button>
              </>
            )}
          </ButtonGroup>

          <SortingSelector sorting={sorting} setSorting={handleSortingChange} groupCompleted={groupCompleted} setGroupCompleted={handleGroupCompletedChange} />
        </div>

        {!isEditing && <Combobox options={itemOptions as Item[]} createOption={(name) => ({ id: uuid(), name, tags: [] })} onAdd={handleAdd} />}

        {groupCompleted ? (
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
          <div className={"flex flex-col gap-4 bg-main p-4 pt-2 pb-2"}>{fullList.map(itemRenderer)}</div>
        )}
      </div>
    </>
  );
}
