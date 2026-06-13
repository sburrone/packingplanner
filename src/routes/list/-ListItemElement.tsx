import { Item, ListItem } from "@/src/types";
import { itemCollection } from "@/src/db";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FC } from "react";

interface ListItemElementProps {
  listItem: ListItem;
  isEditing: boolean;
  handleCheck: (itemId: string, completed: boolean) => void;
  handleDeleteItem: (itemId: string) => void;
}

const ListItemElement: FC<ListItemElementProps> = (props) => {
  const { listItem, isEditing, handleCheck, handleDeleteItem } = props;

  const item = itemCollection.get(listItem.itemId) as Item;

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
        checked={listItem.completed}
        onCheckedChange={(checked) => handleCheck(item.id, checked === true)}
      />
      <Label htmlFor={item.id} className={"w-full text-left"}>
        <span
          className={`relative origin-left text-main-foreground after:absolute after:left-0 after:top-1/2 after:h-0.5 after:w-full after:-translate-y-1/2 after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out ${
            listItem.completed ? "after:scale-x-100" : "after:scale-x-0"
          }`}
        >
          {item.name}
        </span>
      </Label>
    </div>
  );
};

export default ListItemElement;
