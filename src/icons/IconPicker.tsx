// noinspection ShadcnRadixImportJS
// noinspection ShadcnRadixImport

import { ChangeEventHandler, FC, ForwardRefExoticComponent, ReactElement, RefAttributes, useCallback, useEffect, useRef, useState } from "react";
import { icons, LucideProps } from "lucide-react";
import { CellComponentProps, Grid } from "react-window";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import { Input } from "@/components/ui/input";

const CELL_SIZE = 56;
const GRID_GAP = 8;
const MAX_COLUMNS = 30;
const GRID_HEIGHT = "calc(100dvh - 20rem)";

interface IconPickerProps {
  dialogTrigger?: ReactElement | string;
  value?: string;
  onChange?: (value: string | undefined) => void;
}

const IconPicker: FC<IconPickerProps> = (props) => {
  const { dialogTrigger, value, onChange } = props;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredIcons, setFilteredIcons] = useState<[string, ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>][]>(Object.entries(icons));
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const columnCount = Math.min(Math.floor((window.innerWidth - 100) / (CELL_SIZE + GRID_GAP)), MAX_COLUMNS);
  const rowCount = Math.ceil(filteredIcons.length / columnCount);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setFilteredIcons(Object.entries(icons).filter(([key]) => !searchTerm.trim().length || key.toLocaleLowerCase().includes(searchTerm.trim().toLocaleLowerCase())));
    }, 150);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const handleSearchTermChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchTerm(e.target.value);
  };

  const IconCell = useCallback(
    ({ columnIndex, rowIndex, style }: CellComponentProps) => {
      const iconIndex = rowIndex * columnCount + columnIndex;
      const iconEntry = filteredIcons[iconIndex];

      if (!iconEntry) {
        return null;
      }

      const [key, Icon] = iconEntry;
      const isSelected = value === key;

      return (
        <div
          style={{
            ...style,
            width: CELL_SIZE,
            height: CELL_SIZE,
            paddingRight: GRID_GAP,
            paddingBottom: GRID_GAP,
          }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="neutral"
                  className={`h-full w-full max-w-full gap-2 ${isSelected ? "bg-main" : "bg-transparent"} hover:bg-main`}
                  onClick={() => {
                    !!onChange && onChange(key);
                  }}
                >
                  <Icon className="h-6! w-6!" />
                </Button>
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent className={"z-50"}>
                  <span>{key}</span>
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    [columnCount, filteredIcons, value],
  );

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        {!!dialogTrigger && typeof dialogTrigger !== "string" ? (
          dialogTrigger
        ) : (
          <Button className={value ? "bg-chart-5" : undefined}>{typeof dialogTrigger === "string" ? dialogTrigger : "Icone"}</Button>
        )}
      </DialogTrigger>
      <DialogContent style={{ maxWidth: "calc(100dvw - 2rem)", maxHeight: "calc(100dvh - 2rem)" }}>
        <DialogHeader>
          <DialogTitle>Scegli icona</DialogTitle>
        </DialogHeader>
        <Input value={searchTerm} onChange={handleSearchTermChange} placeholder="Cerca icona..." aria-label={"Cerca icona"} />
        <div ref={gridContainerRef} className="overflow-hidden mx-auto" style={{ height: GRID_HEIGHT, width: "fit-content" }}>
          <Grid cellComponent={IconCell} columnCount={columnCount} columnWidth={CELL_SIZE + GRID_GAP} rowCount={rowCount} rowHeight={CELL_SIZE + GRID_GAP} cellProps={{}} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="neutral">Cancella selezione</Button>
          </DialogClose>
          <DialogClose asChild disabled={!!onChange && !value}>
            <Button type="submit">Accetta</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IconPicker;
