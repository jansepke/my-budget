import { Transaction } from "@/domain";
import AddIcon from "@mui/icons-material/Add";
import EuroIcon from "@mui/icons-material/Euro";
import EventIcon from "@mui/icons-material/Event";
import TitleIcon from "@mui/icons-material/Title";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { DateField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { FormEvent, useState } from "react";

export const AddForm = () => {
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
        <DateField
          label="Date"
          defaultValue={dayjs()}
          onChange={(value) => setFormData({ ...formData, date: value ?? dayjs() })}
          format="DD-MM-YYYY"
          InputProps={buildIconStartAdornment(<EventIcon />)}
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
