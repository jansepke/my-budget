import { Category } from "@/domain";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React from "react";

interface CategorySelectorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  categories: Category[];
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange, categories }) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="category">Category</InputLabel>
      <Select labelId="category" label="Category" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        {categories.map((c) => (
          <MenuItem key={c.value} value={c.value}>
            {c.value} - {c.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
