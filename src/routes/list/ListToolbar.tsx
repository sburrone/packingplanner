import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { FC } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Home, Check, Pencil, RotateCcw, Trash } from "lucide-react";
import SortingSelector from "@/src/components/SortingSelector";
import { Sorting } from "@/src/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ListToolbarProps {
  isEditing: boolean;
  toggleEditing: () => void;
  handleSortingChange: (sorting: Sorting) => void;
  sorting: Sorting;
  handleGroupCompletedChange: (groupCompleted: boolean) => void;
  groupCompleted: boolean;
  batchReset: (val?: boolean) => void;
  deleteList: () => void;
}

const ListToolbar: FC<ListToolbarProps> = (props) => {
  const { isEditing, toggleEditing, handleGroupCompletedChange, handleSortingChange, sorting, groupCompleted, batchReset, deleteList } = props;

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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-chart-3">
                  <RotateCcw />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sicurə?</AlertDialogTitle>
                  <AlertDialogDescription>La lista verrà reimpostata. Non puoi tornare indietro.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancella</AlertDialogCancel>
                  <AlertDialogAction onClick={() => batchReset()}>Continua</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <ButtonGroupSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-chart-2">
                  <Trash />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sicurə?</AlertDialogTitle>
                  <AlertDialogDescription>
                    La lista verrà eliminata. Non la potrai recuperare.
                    <br />
                    Gli oggetti inseriti nella lista non verranno eliminati e saranno inseribili in altre liste.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancella</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteList}>Continua</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </ButtonGroup>

      <SortingSelector sorting={sorting} setSorting={handleSortingChange} groupCompleted={groupCompleted} setGroupCompleted={handleGroupCompletedChange} />
    </div>
  );
};

export default ListToolbar;
