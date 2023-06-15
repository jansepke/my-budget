import { Category, Transaction } from "@/domain";
import AddIcon from "@mui/icons-material/Add";
import EuroIcon from "@mui/icons-material/Euro";
import TitleIcon from "@mui/icons-material/Title";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { FormEvent, useState } from "react";

interface AddFormProps {
  categories: Category[];
}

export const AddForm: React.FC<AddFormProps> = ({ categories }) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({ date: dayjs() });

  const addTransaction = (e: FormEvent) => {
    e.preventDefault();

    fetch("/api/transactions", { method: "POST", body: JSON.stringify(formData) });
  };

  const changeHandler = <T,>(field: keyof Transaction, value: T) => setFormData({ ...formData, [field]: value });

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1 },
      }}
      noValidate
      autoComplete="off"
      onSubmit={addTransaction}
    >
      <FormControl component="fieldset" sx={{ flexDirection: "row" }}>
        <DatePicker
          label="Date"
          defaultValue={dayjs()}
          onChange={(value) => setFormData({ ...formData, date: value ?? dayjs() })}
          format="DD-MM-YYYY"
        />
        <TextField
          label="Description"
          onChange={(e) => changeHandler("description", e.target.value)}
          InputProps={buildIconStartAdornment(<TitleIcon />)}
        />
        <TextField
          label="Amount"
          onChange={(e) => changeHandler("amount", Number(e.target.value))}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          InputProps={buildIconStartAdornment(<EuroIcon />)}
        />
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-filled-label">Category</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            label="Category"
            defaultValue=""
            onChange={(e) => changeHandler("category", e.target.value)}
          >
            {categories.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.value} - {c.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormControl>
      <Button type="submit" variant="contained" startIcon={<AddIcon />}>
        Add
      </Button>
    </Box>
  );
};

function buildIconStartAdornment(icon: React.ReactNode) {
  return {
    startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
  };
}
