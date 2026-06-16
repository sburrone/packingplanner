import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useLiveQuery } from "@tanstack/react-db";
import { listCollection } from "@/src/db";
import _ from "lodash";
import { PageHeader } from "@/src/components/PageHeader";
import CreateListButton from "@/src/routes/-CreateListButton";
import { Check, Star } from "lucide-react";
import { useIconResolver } from "@/src/icons/iconResolver";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { List } from "@/src/types";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: lists } = useLiveQuery((q) => q.from({ pref: listCollection }));
  const getIcon = useIconResolver();

  const toggleFavorite = (id: string) => {
    listCollection.update(id, (l) => {
      const list = l as unknown as List;
      list.favorite = !list.favorite;
    });
  };

  return (
    <>
      <PageHeader title={"Valigiatore"} />

      <p className={"p-4 text-center"}>Liste ({lists.length})</p>
      <div className={`flex flex-col gap-4 self-center max-w-96 mx-auto`}>
        <div className={"flex flex-row gap-4"}>
          <CreateListButton />
        </div>

        {_.sortBy(lists, [(el) => -Number(el.favorite), "name", "id"]).map((list) => {
          const [, Icon] = getIcon(list.icon);
          return (
            <ButtonGroup key={list.id} className="w-full">
              <Button onClick={() => toggleFavorite(list.id)} className={`p-0 w-10 justify-center flex flex-row ${list.favorite && "bg-amber-400"}`}>
                {!!Icon ? <Icon className="h-6! w-6!" /> : <Star className={"h-6! w-6!"} />}
              </Button>
              <ButtonGroupSeparator />
              <Link to={`/list/${list.id}`} className={"w-full"}>
                <Button className="flex w-full flex-row gap-2 justify-between">
                  <span className="flex flex-row gap-2 items-center">{list.name}</span>
                  <span className="flex flex-row gap-2 items-center">
                    <Check />
                    {list.items.filter((i) => i.completed).length}/{list.items.length}
                  </span>
                </Button>
              </Link>
            </ButtonGroup>
          );
        })}
      </div>
    </>
  );
}
