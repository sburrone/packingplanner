import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { FC } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Home, Check, Pencil, RotateCcw, Trash } from "lucide-react";
import SortingSelector from "@/src/components/SortingSelector";
import { Sorting } from "@/src/types";

interface ListToolbarProps {
  isEditing: boolean;
  toggleEditing: () => void;
  handleSortingChange: (sorting: Sorting) => void;
  sorting: Sorting;
  handleGroupCompletedChange: (groupCompleted: boolean) => void;
  groupCompleted: boolean;
}

const ListToolbar: FC<ListToolbarProps> = (props) => {
  const { isEditing, toggleEditing, handleGroupCompletedChange, handleSortingChange, sorting, groupCompleted } = props;

  return (
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
  );
};

export default ListToolbar;
