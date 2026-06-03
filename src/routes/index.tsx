import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useLiveQuery } from "@tanstack/react-db";
import { listCollection } from "@/src/db";
import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Formik, FormikValues } from "formik";
import { v6 as uuid } from "uuid";
import _ from "lodash";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showCreationDialog, setShowCreationDialog] = useState(false);
  const { data: lists } = useLiveQuery((q) => q.from({ pref: listCollection }));

  const onCreateList: FormikValues["onsubmit"] = (values: { name: string }) => {
    listCollection.insert({ id: uuid(), name: values.name, items: [] });
  };

  return (
    <>
      <p className={"p-4"}>Liste ({lists.length})</p>
      <div
        className={`grid grid-flow-row grid-cols-${Math.max(lists.length + 1, 3)} gap-4 self-center`}
      >
        {_.sortBy(lists, ["name", "id"]).map((list) => {
          return <Button key={list.id}>{list.name}</Button>;
        })}

        <Dialog>
          <DialogTrigger asChild>
            <Button
              className={"flex flex-col gap-2 h-auto"}
              onClick={() => setShowCreationDialog(true)}
            >
              <Plus /> Crea lista
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
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                isValid,
              }) => (
                <form onSubmit={handleSubmit} className={"grid gap-4"}>
                  <DialogHeader>
                    <DialogTitle>Crea lista</DialogTitle>
                    <DialogDescription>
                      Scegli un nome e un'icona per la nuova lista.
                      Successivamente la potrai modificare.
                    </DialogDescription>
                    <div className={"grid gap-4"}>
                      <div className={"grid gap-3"}>
                        <label htmlFor={"name-1"}>Nome</label>
                        <Input
                          name={"nome"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          aria-label={"nome"}
                        />
                        {errors.name && touched.name && errors.name}
                      </div>
                    </div>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant={"neutral"}>Cancella</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        disabled={isSubmitting || !isValid}
                        type={"submit"}
                      >
                        Crea
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
