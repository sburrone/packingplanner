import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Autocomplete, AutocompleteProps } from "@mui/material";
import { clsx } from "clsx";

type IdentifiableNamed = {
  id: string;
  name: string;
};

export interface ComboboxProps<T extends IdentifiableNamed> {
  initialValue?: T | null;
  options?: T[];
  createOption: (name: string) => T;
  onAdd: (toAdd: T) => void;
}

const Combobox = <T extends IdentifiableNamed>(props: ComboboxProps<T>) => {
  const { initialValue = null, options = [], createOption, onAdd } = props;

  const [value, setValue] = useState<T | null>(initialValue);
  const [inputValue, setInputValue] = useState<string>(initialValue?.name ?? "");

  const handleChange: AutocompleteProps<T, false, false, true>["onChange"] = (event, newValue) => {
    if (typeof newValue === "string") {
      setValue(createOption(newValue));
    } else {
      setValue(newValue);
    }
  };

  return (
    <>
      <div className="flex w-full justify-center items-center space-x-2">
        <Autocomplete
          className={"w-72"}
          value={value}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
            const found = options.find((o) => o.name === newInputValue);
            if (found) setValue(found);
          }}
          onChange={handleChange}
          slotProps={{ listbox: { sx: { backgroundColor: "var(--main)" } } }}
          freeSolo={true}
          selectOnFocus={true}
          options={options}
          getOptionKey={(option) => (typeof option === "string" ? option : option.id)}
          getOptionLabel={(option) => (typeof option === "string" ? option : option.name)}
          renderInput={(props) => {
            return (
              <div className={"w-full"} ref={props.slotProps.input.ref}>
                <Input className={"w-full"} placeholder="Aggiungi oggetto..." aria-label={"Aggiungi oggetto"} type={"text"} {...props.slotProps.htmlInput} />
              </div>
            );
          }}
          renderOption={(props, option) => {
            const { key, ...others } = props;
            console.log(others);
            return (
              <li key={key} style={{ minHeight: "calc(var(--spacing) * 4)" }} {...others}>
                {option.name}
              </li>
            );
          }}
        />

        {inputValue && (
          <Button className={"w-10"} onClick={() => setInputValue("")}>
            <X />
          </Button>
        )}

        <Button
          className={inputValue ? "w-10" : "w-20"}
          onClick={() => {
            if (value) onAdd(value);
            else if (inputValue) onAdd(createOption(inputValue));
          }}
        >
          <Plus /> {!inputValue && "Agg."}
        </Button>
      </div>
    </>
  );
};

export default Combobox;
