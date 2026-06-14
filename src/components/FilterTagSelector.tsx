import { FC } from "react";
import { ItemTag } from "@/src/types";
import { useIconResolver } from "@/src/icons/iconResolver";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Funnel, FunnelX } from "lucide-react";

interface FilterTagSelectorProps {
  itemTagsInList: ItemTag[];
  selectedTagIds: string[];
  onSelectedTagIdsChange: (ids: string[]) => void;
}

const FilterTagSelector: FC<FilterTagSelectorProps> = (props: FilterTagSelectorProps) => {
  const { itemTagsInList, selectedTagIds, onSelectedTagIdsChange } = props;

  const getIcon = useIconResolver();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={selectedTagIds.length ? "bg-chart-5" : ""}>
          <Funnel />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`w-56 ${selectedTagIds.length && "bg-chart-5"}`}>
        <DropdownMenuLabel className={"flex flex-row justify-between items-center"}>
          <span>Filtra per tag</span>
          <Button className={`w-6 h-6 min-w-0 ${selectedTagIds.length && "bg-chart-5"}`} disabled={!selectedTagIds.length} onClick={() => onSelectedTagIdsChange([])}>
            <FunnelX />
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {itemTagsInList.map((itemTag) => {
            const [, Icon] = getIcon(itemTag.icon);
            const isSelected = selectedTagIds.includes(itemTag.id);
            return (
              <DropdownMenuCheckboxItem
                checked={isSelected}
                onCheckedChange={() => {
                  onSelectedTagIdsChange(isSelected ? selectedTagIds.filter((t) => t !== itemTag.id) : [...selectedTagIds, itemTag.id]);
                }}
                onSelect={(event) => event.preventDefault()}
              >
                <div className={"w-full flex flex-row items-center gap-2"}>
                  {!!Icon && <Icon />}
                  {itemTag.name}
                </div>
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterTagSelector;
