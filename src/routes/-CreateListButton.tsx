import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { FC, useState } from "react";
import { Formik, FormikValues } from "formik";
import { listCollection } from "@/src/db";
import { v6 as uuid } from "uuid";
import { useLiveQuery } from "@tanstack/react-db";
import { Input } from "@/components/ui/input";

const CreateListButton: FC = () => {
  const [open, setOpen] = useState(false);
  const { data: lists } = useLiveQuery((q) => q.from({ pref: listCollection }));

  const onCreateList: FormikValues["onsubmit"] = (values: { name: string }) => {
    listCollection.insert({ id: uuid(), name: values.name, items: [] });
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
          initialValues={{ name: `Lista numero ${lists.length + 1}` }}
          validate={(values) => {
            if (!values.name) return { name: "Richiesto" };
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid }) => (
            <form onSubmit={handleSubmit} className={"grid gap-4"}>
              <DialogHeader>
                <DialogTitle>Crea lista</DialogTitle>
                <DialogDescription>Scegli un nome e un'icona per la nuova lista. Successivamente la potrai modificare.</DialogDescription>
                <div className={"grid gap-4"}>
                  <div className={"grid gap-3"}>
                    <label htmlFor={"name"}>Nome</label>
                    <Input id={"name"} name={"name"} onChange={handleChange} onBlur={handleBlur} value={values.name} aria-label={"nome"} />
                    {errors.name && touched.name && errors.name}
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
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListButton;
