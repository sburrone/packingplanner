import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useLiveQuery } from "@tanstack/react-db";
import { listCollection } from "@/src/db";
import _ from "lodash";
import { PageHeader } from "@/src/components/PageHeader";
import CreateListButton from "@/src/routes/-CreateListButton";
import { Check } from "lucide-react";
import { useIconResolver } from "@/src/icons/iconResolver";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: lists } = useLiveQuery((q) => q.from({ pref: listCollection }));
  const getIcon = useIconResolver();

  return (
    <>
      <PageHeader title={"Valigiatore"} />

      <p className={"p-4 text-center"}>Liste ({lists.length})</p>
      <div className={`flex flex-col gap-4 self-center max-w-96 mx-auto`}>
        <div className={"flex flex-row gap-4"}>
          <CreateListButton />
        </div>

        {_.sortBy(lists, ["name", "id"]).map((list) => {
          const [, Icon] = getIcon(list.icon);
          return (
            <Link key={list.id} to={`/list/${list.id}`}>
              <Button className="w-full flex flex-row justify-between">
                <span className="flex flex-row gap-2 items-center">
                  {!!Icon && <Icon className="-ml-2 h-10! w-8! pr-2 border-r-2" />}
                  {list.name}
                </span>
                <span className="flex flex-row gap-2 items-center">
                  <Check />
                  {list.items.filter((i) => i.completed).length}/{list.items.length}
                </span>
              </Button>
            </Link>
          );
        })}
      </div>
    </>
  );
}
