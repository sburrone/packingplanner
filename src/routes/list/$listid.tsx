import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slide } from "@mui/material";
import { useListUtils } from "@/src/hooks/useListUtils";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/src/components/PageHeader";
import ListToolbar from "@/src/routes/list/-ListToolbar";
import ListItemElement from "@/src/routes/list/-ListItemElement";
import ObjectCreator from "@/src/components/ObjectCreator";

export const Route = createFileRoute("/list/$listid")({
  component: RouteComponent,
});

function RouteComponent() {
  const { listid } = Route.useParams();

  const {
    handleGroupCompletedChange,
    handleSortingChange,
    sorting,
    groupCompleted,
    handleCheck,
    handleAdd,
    currentList,
    itemsCompleted,
    itemsToComplete,
    listNameInput,
    handleListNameInputChange,
    isEditing,
    toggleEditing,
    handleDeleteItem,
    deleteList,
    batchReset,
    selectedTagIds,
    setSelectedTagIds,
    itemTagsInList,
    fullListFilteredByTags,
    colorPalette,
  } = useListUtils({
    listid,
  });

  if (!currentList)
    return (
      <>
        <PageHeader title={"Valigiatore"} />

        <div className={"flex flex-col gap-2 items-center"}>
          <h3>Questa pagina non esiste.</h3>

          <Link to={"/"}>
            <Button>Torna alla home</Button>
          </Link>
        </div>
      </>
    );

  return (
    <>
      <PageHeader
        title={
          isEditing ? (
            <div className={"flex flex-row w-96 mx-auto px-4"}>
              <Input className={"text-xl font-sans bg-white text-black flex-1 w-full h-9"} aria-label={"Rinomina lista"} value={listNameInput} onChange={handleListNameInputChange} />
            </div>
          ) : (
            currentList.name
          )
        }
      />

      <div className={"flex flex-col gap-2 items-center w-96 max-w-dvw justify-center px-4 mx-auto"}>
        <ListToolbar
          isEditing={isEditing}
          toggleEditing={toggleEditing}
          handleSortingChange={handleSortingChange}
          sorting={sorting}
          handleGroupCompletedChange={handleGroupCompletedChange}
          groupCompleted={groupCompleted}
          deleteList={deleteList}
          batchReset={batchReset}
          selectedTagIds={selectedTagIds}
          onSelectedTagIdsChange={setSelectedTagIds}
          itemTagsInList={itemTagsInList}
        />

        {!isEditing && <ObjectCreator onAdd={handleAdd} />}

        {groupCompleted ? (
          <>
            <Accordion type={"multiple"} className={"w-full flex flex-col gap-2"} defaultValue={["completed", "toComplete"]}>
              <Slide direction={"right"} in={!!itemsToComplete.length} unmountOnExit={true}>
                <AccordionItem value={"toComplete"}>
                  <AccordionTrigger className={"h-10"}>Da completare ({itemsToComplete.length})</AccordionTrigger>
                  <AccordionContent className={"flex flex-col gap-4 bg-main p-4 pt-2 pb-2"}>
                    {itemsToComplete.map((li) => (
                      <ListItemElement
                        key={li.itemId}
                        listItem={li}
                        isEditing={isEditing}
                        handleCheck={handleCheck}
                        handleDeleteItem={handleDeleteItem}
                        selectedTagIds={selectedTagIds}
                        onSelectedTagIdsChange={setSelectedTagIds}
                        colorPalette={colorPalette}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Slide>
              <Slide direction={"right"} in={!!itemsCompleted.length} unmountOnExit={true}>
                <AccordionItem value={"completed"}>
                  <AccordionTrigger className={"h-10"}>Completati ({itemsCompleted.length})</AccordionTrigger>
                  <AccordionContent className={"flex flex-col gap-4 bg-main p-4 pt-2 pb-2"}>
                    {itemsCompleted.map((li) => (
                      <ListItemElement
                        key={li.itemId}
                        listItem={li}
                        isEditing={isEditing}
                        handleCheck={handleCheck}
                        handleDeleteItem={handleDeleteItem}
                        selectedTagIds={selectedTagIds}
                        onSelectedTagIdsChange={setSelectedTagIds}
                        colorPalette={colorPalette}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Slide>
            </Accordion>
          </>
        ) : (
          !!fullListFilteredByTags.length && (
            <div className={"flex flex-col gap-4 bg-main p-4 pt-2 pb-2"}>
              {fullListFilteredByTags.map((li) => (
                <ListItemElement
                  key={li.itemId}
                  listItem={li}
                  isEditing={isEditing}
                  handleCheck={handleCheck}
                  handleDeleteItem={handleDeleteItem}
                  selectedTagIds={selectedTagIds}
                  onSelectedTagIdsChange={setSelectedTagIds}
                  colorPalette={colorPalette}
                />
              ))}
            </div>
          )
        )}
      </div>
    </>
  );
}
