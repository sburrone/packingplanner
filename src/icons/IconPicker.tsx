import { icons } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const IconPicker = () => {
  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button>Icone</Button>
      </DialogTrigger>
      <DialogContent style={{ maxWidth: "calc(100dvw - 2rem)", maxHeight: "calc(100dvh - 2rem" }}>
        <DialogHeader>
          <DialogTitle>Scegli icona</DialogTitle>
        </DialogHeader>
        <div className={"grid grid-flow-row gap-2 grid-cols-10 overflow-y-auto overflow-x-hidden"} style={{ maxHeight: "calc(100dvh - 20rem)" }}>
          {Object.entries(icons).map(([key, Icon]) => {
            return (
              <Button variant={"neutral"} key={key} className={"h-full flex flex-col gap-2 bg-transparent hover:bg-main"}>
                <Icon className="h-8 w-8" />
                <span className={"text-xs dark:text-gray-400 not-dark:text-gray-600"}>{key}</span>
              </Button>
            );
          })}
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
