import { FC, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapse } from "@mui/material";
import { Input } from "@/components/ui/input";
import IconPicker from "@/src/icons/IconPicker";
import { tagCollection } from "@/src/db";
import { v7 as uuid } from "uuid";
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { useIconResolver } from "@/src/icons/iconResolver";
import { setIn } from "formik";

const TagCreator: FC = () => {
  const [showCreation, setShowCreation] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [iconValue, setIconValue] = useState<string | undefined>(undefined);

  const getIcon = useIconResolver();

  const addTag = () => {
    tagCollection.insert({ id: uuid(), name: inputValue, icon: iconValue });
    togglePanel();
  };

  const togglePanel = () => {
    if (showCreation) {
      setInputValue("");
      setIconValue(undefined);
      setShowCreation(false);
    } else {
      setShowCreation(true);
    }
  };

  const [, Icon] = getIcon(iconValue);

  return (
    <>
      <Button className={`w-fit h-6 ${showCreation && "bg-chart-5"}`} onClick={togglePanel}>
        <Plus />
        Nuovo tag
      </Button>
      <Collapse in={showCreation} className={"w-full"}>
        <Card className="bg-chart-5 gap-2 py-4 w-full">
          <CardHeader>
            <CardDescription>Scegli un nome e un'icona per il nuovo tag.</CardDescription>
          </CardHeader>
          <CardContent className={"flex flex-col gap-2"}>
            <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Nome tag..." aria-label={"Nome tag"} />
            <div className={"flex flex-row gap-2 justify-between"}>
              <IconPicker
                onChange={setIconValue}
                value={iconValue}
                dialogTrigger={
                  !!(iconValue && Icon) ? (
                    <Button>
                      <Icon /> Icona
                    </Button>
                  ) : (
                    "Scegli icona..."
                  )
                }
              />
              <Button className="bg-chart-4" onClick={addTag} disabled={!inputValue.length}>
                Crea tag
              </Button>
            </div>
          </CardContent>
        </Card>
      </Collapse>
    </>
  );
};

export default TagCreator;
