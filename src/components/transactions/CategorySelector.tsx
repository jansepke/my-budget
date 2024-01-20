import { Category } from "@/domain";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import React from "react";

interface CategorySelectorProps {
  value?: string;
  onChange: (value: Category | null) => void;
  categories: Category[];
  fullWidth?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange, categories, fullWidth }) => (
  <FormControl fullWidth={fullWidth} sx={{ minWidth: 250 }}>
    <Autocomplete
      renderInput={(params) => <TextField {...params} label="Category" />}
      value={categories.find((c) => c.value === value) ?? null}
      onChange={(e, c) => onChange(c)}
      getOptionLabel={(c) => `${c.value} - ${c.label}`}
      filterOptions={(options, state) =>
        options.filter((o) => o.value.toLowerCase().includes(state.inputValue.toLowerCase()))
      }
      options={categories}
      selectOnFocus
      clearOnBlur
    />
  </FormControl>
);
