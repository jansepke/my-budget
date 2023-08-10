import { Category } from "@/domain";
import ClearIcon from "@mui/icons-material/Clear";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React from "react";

interface CategorySelectorProps {
  value: string | undefined | null;
  onChange: (value: string | undefined) => void;
  categories: Category[];
  fullWidth?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange, categories, fullWidth }) => (
  <FormControl fullWidth={fullWidth} sx={{ minWidth: 250 }}>
    <InputLabel id="category">Category</InputLabel>
    <Select
      labelId="category"
      label="Category"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      endAdornment={
        <IconButton onClick={() => onChange(undefined)}>
          <ClearIcon />
        </IconButton>
      }
    >
      {categories.map((c) => (
        <MenuItem key={c.value} value={c.value}>
          {c.value} - {c.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
