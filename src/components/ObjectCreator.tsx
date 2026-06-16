import { Item, ItemTag } from "../types";
import { ChangeEventHandler, FC, useEffect, useMemo, useState } from "react";
import { useLiveQuery } from "@tanstack/react-db";
import { itemCollection, listCollection, tagCollection } from "@/src/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus, Pencil } from "lucide-react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Collapse } from "@mui/material";
import { useIconResolver } from "@/src/icons/iconResolver";
import _ from "lodash";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import TagCreator from "@/src/components/TagCreator";
import { v7 as uuid } from "uuid";

interface ObjectCreatorProps {
  onAdd: (item: Item) => void;
  mode?: "add" | "edit";
  defaultInputValue?: string;
  defaultTags?: ItemTag[];
}

const ObjectCreator: FC<ObjectCreatorProps> = (props) => {
  const { onAdd, mode, defaultInputValue, defaultTags } = props;

  const { data: lists } = useLiveQuery((q) => q.from({ pref: listCollection }));
  const itemHits = useMemo(
    () =>
      _.chain(lists)
        .flatMap((list) => list.items)
        .countBy((item) => item.itemId)
        .map((occurrences, itemId) => ({ itemId, occurrences }))
        .orderBy(["occurrences"], ["desc"])
        .value(),
    [lists],
  );

  const { data: itemOptions } = useLiveQuery((q) => q.from({ pref: itemCollection }));
  const { data: tagOptions } = useLiveQuery((q) => q.from({ pref: tagCollection }));

  const [selectedTags, setSelectedTags] = useState<ItemTag[]>(defaultTags ?? []);
  const [inputValue, setInputValue] = useState<string>(defaultInputValue ?? "");
  const [showPanel, setShowPanel] = useState<boolean>(false);

  const sortItemSuggestions = (suggestions: Item[]) => {
    return _.sortBy(suggestions, [(el) => itemHits.find((i) => i.itemId === el.id)?.occurrences ?? 0, "name"]);
  };

  const [itemSuggestions, setItemSuggestions] = useState<Item[]>(sortItemSuggestions(itemOptions as Item[]));

  const getIcon = useIconResolver();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setItemSuggestions(sortItemSuggestions(itemOptions.filter((itemOption) => itemOption.name.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()))));
    }, 150);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [inputValue]);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
  };

  const handleNameSuggested = (item: Item) => {
    setInputValue(item.name);
    if (item.tags.length && !selectedTags.length) {
      setSelectedTags(item.tags);
    }
  };

  const handleAdd = () => {
    if (inputValue) {
      onAdd({ id: uuid(), name: inputValue, tags: selectedTags });
      setInputValue("");
      setSelectedTags([]);
      setShowPanel(false);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSelectedTags([]);
  };

  return (
    <>
      <div className="flex w-full justify-center items-center space-x-2">
        <Input
          className={"w-72"}
          value={inputValue}
          onChange={handleInputChange}
          aria-label={mode === "edit" ? "Modifica oggetto" : "Aggiungi oggetto"}
          placeholder={mode === "edit" ? "Modifica oggetto" : "Aggiungi oggetto..."}
          onFocus={() => setShowPanel(true)}
        />
        <ButtonGroup>
          {!!inputValue.length && (
            <>
              <Button className={"w-10"} onClick={handleClear}>
                <X />
              </Button>
              <ButtonGroupSeparator />
            </>
          )}
          <Button className={`bg-chart-4 ${inputValue.length ? "w-10" : "w-20"}`} disabled={!inputValue.length} onClick={handleAdd}>
            {mode === "edit" ? (
              <>
                <Pencil /> {!inputValue && "Salva"}
              </>
            ) : (
              <>
                <Plus /> {!inputValue && "Agg."}
              </>
            )}
          </Button>
        </ButtonGroup>
      </div>

      <Collapse in={showPanel || mode === "edit"} className={"w-96 px-2"}>
        <Card className="w-full bg-secondary">
          {mode !== "edit" && (
            <CardHeader className={"flex flex-row items-center justify-between"}>
              <CardTitle>Aggiungi oggetto</CardTitle>
              <Button variant="noShadow" className="w-6 h-6 px-0" onClick={() => setShowPanel(false)}>
                <X />
              </Button>
            </CardHeader>
          )}
          <CardContent className={"flex flex-col gap-4"}>
            {!!itemSuggestions.length && (
              <div>
                <span>Nomi usati in precedenza</span>
                <div className={"flex flex-row flex-wrap overflow-x-hidden gap-2 pb-2"}>
                  {itemSuggestions.slice(0, 7).map((item) => {
                    return (
                      <Button
                        key={item.id}
                        className={`w-fit h-6 flex max-w-full overflow-hidden text-center text-nowrap ${inputValue === item.name && item.tags.every((t) => selectedTags.find((st) => st.id === t.id)) && "bg-chart-5"}`}
                        onClick={() => handleNameSuggested(item)}
                      >
                        {item.tags.map((itemTag) => {
                          const [, Icon] = getIcon(itemTag.icon);
                          if (Icon) return <Icon className="shrink-0" key={itemTag.id} />;
                        })}
                        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{item.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
            <div>
              <span>Tag</span>
              <div className={"flex flex-row flex-wrap overflow-x-auto gap-2 pb-2"}>
                <TagCreator />
                {tagOptions.map((tag: ItemTag) => {
                  const [, Icon] = getIcon(tag.icon);
                  const isSelected = selectedTags.find((t) => t.id === tag.id);
                  return (
                    <Button
                      key={tag.id}
                      className={`w-fit h-6 ${isSelected && "bg-chart-5"}`}
                      onClick={() =>
                        setSelectedTags((prev) => {
                          if (isSelected) return [...prev.slice().filter((t) => t.id !== tag.id)];
                          else return [...prev.slice(), tag];
                        })
                      }
                    >
                      {!!Icon && <Icon />}
                      {tag.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </Collapse>
    </>
  );
};

export default ObjectCreator;
