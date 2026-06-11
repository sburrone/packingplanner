import { Sorting } from "@/src/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowDownAZ, ArrowDownZA, ArrowUp, Clock, Clock8 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SortingProps {
  sorting: Sorting;
  setSorting: (sorting: Sorting) => void;
  groupCompleted: boolean;
  setGroupCompleted: (groupCompleted: boolean) => void;
}

const SortingSelector: React.FC<SortingProps> = (props) => {
  const { sorting, setSorting, setGroupCompleted, groupCompleted } = props;

  const getButton = () => {
    switch (sorting) {
      case Sorting.ADDED_ASC:
      default:
        return (
          <>
            <Clock />
            <ArrowUp />
          </>
        );
      case Sorting.ADDED_DESC:
        return (
          <>
            <Clock8 />
            <ArrowDown />
          </>
        );
      case Sorting.ALPHA_ASC:
        return (
          <>
            <ArrowDownAZ />
            <ArrowUp />
          </>
        );
      case Sorting.ALPHA_DESC:
        return (
          <>
            <ArrowDownZA />
            <ArrowDown />
          </>
        );
    }
  };

  const getOption = (sorting: Sorting) => {
    switch (sorting) {
      case Sorting.ADDED_ASC:
      default:
        return (
          <>
            <Clock /> Data di aggiunta <ArrowUp />
          </>
        );
      case Sorting.ADDED_DESC:
        return (
          <>
            <Clock8 /> Data di aggiunta <ArrowDown />
          </>
        );
      case Sorting.ALPHA_ASC:
        return (
          <>
            <ArrowDownAZ /> Alfabetico <ArrowUp />
          </>
        );
      case Sorting.ALPHA_DESC:
        return (
          <>
            <ArrowDownZA /> Alfabetico <ArrowDown />
          </>
        );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Ordina {getButton()}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={"w-56"}>
        <DropdownMenuLabel className={"flex flex-row gap-3 items-center"}>
          <Checkbox id={"groupCompleted"} checked={groupCompleted} onCheckedChange={setGroupCompleted} />
          <Label htmlFor={"groupCompleted"}>Raggruppa completati</Label>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {Object.values(Sorting).map((s) => {
            return (
              <DropdownMenuItem key={s} onClick={() => setSorting(s as Sorting)}>
                {getOption(s as Sorting)}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortingSelector;
