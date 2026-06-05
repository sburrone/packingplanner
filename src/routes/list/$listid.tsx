import { createFileRoute, useLocation } from "@tanstack/react-router";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { itemCollection, listCollection } from "@/src/db";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Item, List } from "@/src/types";
import Combobox from "@/src/components/Combobox";
import { v6 as uuid } from "uuid";

export const Route = createFileRoute("/list/$listid")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const { listid } = Route.useParams();

  const { data: currentList } = useLiveQuery((q) =>
    q
      .from({ pref: listCollection })
      .where(({ pref: list }) => eq(list.id, listid))
      .findOne(),
  );

  const { data: itemOptions } = useLiveQuery((q) => q.from({ pref: itemCollection }));

  const handleCheck = (id: string, completed: boolean) => {
    listCollection.update(listid, (l) => {
      const list = l as unknown as List;
      const item = list.items.find((item) => item.itemId === id);

      if (!item) return;

      item.completed = completed;
    });
  };

  const handleAdd = (item: Item) => {
    itemCollection.insert(item);
  };

  if (!currentList) return;

  return (
    <>
      <h3>{currentList.name}</h3>
      {currentList.items.map((item) => {
        return (
          <Card className="w-full max-w-sm" key={item.itemId}>
            <CardContent>
              <Checkbox checked={item.completed} onCheckedChange={(checked) => handleCheck(item.itemId, checked === true)} />
            </CardContent>
          </Card>
        );
      })}
      <Combobox options={itemOptions as Item[]} createOption={(name) => ({ id: uuid(), name, tags: [] })} onAdd={handleAdd} />
    </>
  );
}
