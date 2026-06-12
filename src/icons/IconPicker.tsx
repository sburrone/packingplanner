// noinspection ShadcnRadixImportJS
// noinspection ShadcnRadixImport

import { useCallback, useMemo, useRef, useState } from "react";
import { icons } from "lucide-react";
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

const IconPicker = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const iconEntries = useMemo(() => {
    return Object.entries(icons).filter(([key]) => key.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));
  }, [searchTerm]);
  const columnCount = Math.min(Math.floor((window.innerWidth - 100) / (CELL_SIZE + GRID_GAP)), MAX_COLUMNS);
  const rowCount = Math.ceil(iconEntries.length / columnCount);

  const IconCell = useCallback(
    ({ columnIndex, rowIndex, style }: CellComponentProps) => {
      const iconIndex = rowIndex * columnCount + columnIndex;
      const iconEntry = iconEntries[iconIndex];

      if (!iconEntry) {
        return null;
      }

      const [key, Icon] = iconEntry;

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
                <Button variant="neutral" className="h-full w-full max-w-full gap-2 bg-transparent hover:bg-main">
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
    [columnCount, iconEntries],
  );

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button>Icone</Button>
      </DialogTrigger>
      <DialogContent style={{ maxWidth: "calc(100dvw - 2rem)", maxHeight: "calc(100dvh - 2rem)" }}>
        <DialogHeader>
          <DialogTitle>Scegli icona</DialogTitle>
        </DialogHeader>
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cerca icona..." aria-label={"Cerca icona"} />
        <div ref={gridContainerRef} className="overflow-hidden mx-auto" style={{ height: GRID_HEIGHT, width: "fit-content" }}>
          <Grid cellComponent={IconCell} columnCount={columnCount} columnWidth={CELL_SIZE + GRID_GAP} rowCount={rowCount} rowHeight={CELL_SIZE + GRID_GAP} cellProps={{}} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="neutral">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IconPicker;
