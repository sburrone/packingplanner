import { Sorting } from "@/src/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowDownAZ, ArrowDownZA, ArrowUp, Clock, Clock8 } from "lucide-react";

interface SortingProps {
  sorting: Sorting;
  onChange: (sorting: Sorting) => void;
}

const SortingSelector: React.FC<SortingProps> = (props) => {
  const { sorting, onChange } = props;

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
        <Button>{getOption(sorting)}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={"w-56"}>
        <DropdownMenuLabel>Riordina lista</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {Object.values(Sorting).map((s) => {
            console.log(s);
            return (
              <DropdownMenuItem key={s} onClick={() => onChange(s as Sorting)}>
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
