import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useLiveQuery } from "@tanstack/react-db";
import { listCollection } from "@/src/db";
import _ from "lodash";
import { PageHeader } from "@/src/components/PageHeader";
import CreateListButton from "@/src/routes/-CreateListButton";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: lists } = useLiveQuery((q) => q.from({ pref: listCollection }));

  return (
    <>
      <PageHeader title={"Valigiatore"} />

      <p className={"p-4 text-center"}>Liste ({lists.length})</p>
      <div className={`flex flex-col gap-4 self-center max-w-96 mx-auto`}>
        <div className={"flex flex-row gap-4"}>
          <CreateListButton />
        </div>

        {_.sortBy(lists, ["name", "id"]).map((list) => {
          return (
            <Link key={list.id} to={`/list/${list.id}`}>
              <Button className="w-full">{list.name}</Button>
            </Link>
          );
        })}
      </div>
    </>
  );
}
