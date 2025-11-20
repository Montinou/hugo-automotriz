"use client";

import * as React from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getPlacePredictions, getPlaceDetails } from "@/app/actions/places";


interface AddressAutocompleteProps {
  onAddressSelect: (address: string, lat: string, lng: string) => void;
  defaultValue?: string;
}

export function AddressAutocomplete({ onAddressSelect, defaultValue = "" }: AddressAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [inputValue, setInputValue] = React.useState("");
  const [predictions, setPredictions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Simple debounce implementation inside useEffect
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputValue.length > 2) {
        setLoading(true);
        const result = await getPlacePredictions(inputValue);
        if (result.predictions) {
          setPredictions(result.predictions);
        }
        setLoading(false);
      } else {
        setPredictions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSelect = async (placeId: string, description: string) => {
    setValue(description);
    setOpen(false);
    
    const details = await getPlaceDetails(placeId);
    if (details.result) {
      const { lat, lng } = details.result.geometry.location;
      onAddressSelect(description, lat.toString(), lng.toString());
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Buscar dirección..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Buscar calle, zona o lugar..." 
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Buscando..." : "No se encontraron resultados."}
            </CommandEmpty>
            <CommandGroup>
              {predictions.map((prediction) => (
                <CommandItem
                  key={prediction.place_id}
                  value={prediction.description}
                  onSelect={() => handleSelect(prediction.place_id, prediction.description)}
                >
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  {prediction.description}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === prediction.description ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
