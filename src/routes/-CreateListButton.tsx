import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { icons, Plus } from "lucide-react";
import { FC, useState } from "react";
import { Formik, FormikValues } from "formik";
import { listCollection } from "@/src/db";
import { v6 as uuid } from "uuid";
import { useLiveQuery } from "@tanstack/react-db";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import IconPicker from "@/src/icons/IconPicker";
import { useIconResolver } from "@/src/icons/iconResolver";

const CreateListButton: FC = () => {
  const [open, setOpen] = useState(false);
  const { data: lists } = useLiveQuery((q) => q.from({ pref: listCollection }));
  const getIcon = useIconResolver();

  const onCreateList: FormikValues["onsubmit"] = (values: { name: string; icon?: string }) => {
    listCollection.insert({ id: uuid(), name: values.name, items: [], icon: values.icon });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={"flex flex-col gap-2 h-auto bg-chart-5 w-full"}>
          <Plus /> Crea nuova
        </Button>
      </DialogTrigger>
      <DialogContent className={"sm:max-w-100"}>
        <Formik
          onSubmit={onCreateList}
          initialValues={{ name: `Lista numero ${lists.length + 1}`, icon: undefined }}
          validate={(values) => {
            const err: { name?: string; icon?: string } = {};
            if (!values.name) err.name = "Richiesto";
            if (values.icon && !Object.keys(icons).includes(values.icon)) err.icon = "Icona non valida";
            return err;
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid, setFieldValue }) => {
            const [foundKey, FoundIcon] = getIcon(values.icon);
            return (
              <form onSubmit={handleSubmit} className={"grid gap-4"}>
                <DialogHeader>
                  <DialogTitle>Crea lista</DialogTitle>
                  <DialogDescription>Scegli un nome e un'icona per la nuova lista. Successivamente la potrai modificare.</DialogDescription>
                  <div className={"grid gap-4"}>
                    <div className={"grid gap-3"}>
                      <Label htmlFor={"name"}>Nome</Label>
                      <Input id={"name"} name={"name"} onChange={handleChange} onBlur={handleBlur} value={values.name} aria-label={"nome"} />
                      {errors.name && touched.name && errors.name}
                    </div>
                    <div className={"grid gap-3"}>
                      <Label htmlFor={"icon"}>Icona</Label>
                      <div className={"flex flex-row gap-2 justify-between items-center"}>
                        <IconPicker value={values.icon} onChange={(val) => setFieldValue("icon", val, true)} dialogTrigger={"Scegli icona..."} />
                        <span className={"flex flex-row gap-2 items-center"}>
                          {values.icon && foundKey && FoundIcon ? (
                            <>
                              <FoundIcon /> {foundKey}
                            </>
                          ) : (
                            "Nessuna icona selezionata"
                          )}
                        </span>
                      </div>
                      {errors.icon && touched.icon && errors.icon}
                    </div>
                  </div>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant={"neutral"} type={"button"}>
                      Cancella
                    </Button>
                  </DialogClose>
                  <Button disabled={isSubmitting || !isValid} type={"submit"}>
                    Crea
                  </Button>
                </DialogFooter>
              </form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListButton;
