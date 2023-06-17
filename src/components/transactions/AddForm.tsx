import { Account, Category, Transaction } from "@/domain";
import AddIcon from "@mui/icons-material/Add";
import EuroIcon from "@mui/icons-material/Euro";
import TitleIcon from "@mui/icons-material/Title";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { FormEvent, useState } from "react";

type TransactionType = "out" | "in";

interface AddFormProps {
  accounts: Account[];
  categories: Category[];
}

export const AddForm: React.FC<AddFormProps> = ({ accounts, categories }) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({ date: dayjs(), from: 1 });
  const [type, setType] = useState<TransactionType>("out");

  const addTransaction = (e: FormEvent) => {
    e.preventDefault();

    fetch("/api/transactions", { method: "POST", body: JSON.stringify(formData) });
  };

  const changeHandler = <T,>(field: keyof Transaction, value: T) => setFormData({ ...formData, [field]: value });

  return (
    <Stack
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={addTransaction}
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <FormControl fullWidth>
        <FormLabel>Type</FormLabel>
        <ToggleButtonGroup
          value={type}
          onChange={(e: unknown, value: TransactionType) => value && setType(value)}
          color="primary"
          exclusive
          fullWidth
        >
          <ToggleButton value="out">outgoing</ToggleButton>
          <ToggleButton value="in">incoming</ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
      {type === "out" && (
        <FormControl fullWidth>
          <FormLabel>From</FormLabel>
          <ToggleButtonGroup
            value={formData.from}
            onChange={(e: unknown, value: number) => value && changeHandler("from", value)}
            color="primary"
            exclusive
            fullWidth
          >
            {accounts.map((a) => (
              <ToggleButton key={a.id} value={a.id}>
                {a.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </FormControl>
      )}
      <DatePicker
        label="Date"
        defaultValue={dayjs()}
        onChange={(value) => changeHandler("date", value ?? dayjs())}
        format="DD-MM-YYYY"
        slotProps={{ textField: { fullWidth: true } }}
      />
      <TextField
        label="Description"
        fullWidth
        onChange={(e) => changeHandler("description", e.target.value)}
        InputProps={buildIconStartAdornment(<TitleIcon />)}
      />
      <TextField
        label="Amount"
        fullWidth
        onChange={(e) => changeHandler("amount", Number(e.target.value))}
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        InputProps={buildIconStartAdornment(<EuroIcon />)}
      />
      <FormControl fullWidth>
        <InputLabel id="category">Category</InputLabel>
        <Select
          labelId="category"
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
      <Button type="submit" variant="contained" startIcon={<AddIcon />} sx={{ maxWidth: 120 }}>
        Add
      </Button>
    </Stack>
  );
};

function buildIconStartAdornment(icon: React.ReactNode) {
  return {
    startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
  };
}
