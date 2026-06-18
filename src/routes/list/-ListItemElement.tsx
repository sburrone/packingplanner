import { Item, ListItem } from "@/src/types";
import { itemCollection } from "@/src/db";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FC, useState } from "react";
import { useIconResolver } from "@/src/icons/iconResolver";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ObjectCreator from "@/src/components/ObjectCreator";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ColorModel } from "@martinlaxenaire/color-palette-generator";

interface ListItemElementProps {
  listItem: ListItem;
  isEditing: boolean;
  handleCheck: (itemId: string, completed: boolean) => void;
  handleDeleteItem: (itemId: string) => void;
  selectedTagIds: string[];
  onSelectedTagIdsChange: (ids: string[]) => void;
  colorPalette: Record<string, ColorModel>;
}

const ListItemElement: FC<ListItemElementProps> = (props) => {
  const { listItem, isEditing, handleCheck, handleDeleteItem, selectedTagIds, onSelectedTagIdsChange, colorPalette } = props;

  const [showPanel, setShowPanel] = useState<boolean>(false);

  const item = itemCollection.get(listItem.itemId) as Item;

  const getIcon = useIconResolver();

  if (!item) return;

  const onTagSelect = (id: string) => {
    if (selectedTagIds.includes(id)) {
      onSelectedTagIdsChange(selectedTagIds.filter((t) => t !== id));
    } else {
      onSelectedTagIdsChange([...selectedTagIds, id]);
    }
  };

  if (isEditing)
    return (
      <>
        <div key={item.id} className={"flex flex-row gap-3 items-center w-80 min-h-7 h-fit"}>
          <span className={"text-left text-main-foreground flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"}>{item.name}</span>
          <ButtonGroup>
            <Dialog open={showPanel} onOpenChange={setShowPanel}>
              <DialogTrigger asChild>
                <Button className={"bg-chart-5 h-7 w-7"} variant="reverse" onClick={() => setShowPanel(!showPanel)}>
                  <Pencil />
                </Button>
              </DialogTrigger>
              <DialogContent className={"w-fit"}>
                <DialogTitle>Modifica oggetto</DialogTitle>
                <ObjectCreator onAdd={console.log} mode={"edit"} defaultInputValue={item.name} defaultTags={item.tags} />
              </DialogContent>
            </Dialog>
            <ButtonGroupSeparator />
            <Button className={"bg-chart-2 h-7 w-7"} variant="reverse" onClick={() => handleDeleteItem(item.id)}>
              <Trash />
            </Button>
          </ButtonGroup>
        </div>
      </>
    );

  return (
    <div key={item.id} className={"flex flex-row gap-3 items-center w-80 min-h-7 h-fit"}>
      <Checkbox
        className="transition-transform duration-200 ease-out data-[state=checked]:scale-110 data-[state=unchecked]:scale-100"
        id={item.id}
        checked={listItem.completed}
        onCheckedChange={(checked) => handleCheck(item.id, checked === true)}
      />
      <Label htmlFor={item.id} className={"w-full flex flex-row justify-between items-center"}>
        <span
          className={`wrap-anywhere relative origin-left text-main-foreground after:absolute after:left-0 after:top-1/2 after:h-0.5 after:w-full after:-translate-y-1/2 after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out ${
            listItem.completed ? "after:scale-x-100" : "after:scale-x-0"
          }`}
        >
          {item.name}
        </span>
        {!!item.tags.length && (
          <ButtonGroup>
            {item.tags.map((tag, index) => {
              const [, Icon] = getIcon(tag.icon);
              const isSelected = selectedTagIds.includes(tag.id);
              const color = colorPalette[tag.id];
              const style =
                isSelected || !selectedTagIds.length
                  ? {
                      backgroundColor: color.hex,
                      color: `contrast-color(${color.hex})`,
                    }
                  : {
                      backgroundColor: "gray",
                      color: `contrast-color(gray)`,
                    };

              return (
                <>
                  <TooltipProvider key={tag.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant={"reverse"} className={`h-7 w-7`} style={style} onClick={() => onTagSelect(tag.id)}>
                          {!!Icon ? <Icon /> : tag.name.slice(0, 1).toLocaleUpperCase()}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side={"bottom"} style={style}>
                        {tag.name}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {index < item.tags.length - 1 && <ButtonGroupSeparator />}
                </>
              );
            })}
          </ButtonGroup>
        )}
      </Label>
    </div>
  );
};

export default ListItemElement;
