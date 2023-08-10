import { AccountSelector } from "@/components/transactions/AccountSelector";
import { Account, Category, NewTransaction } from "@/domain";
import { customFetch } from "@/utils";
import AddIcon from "@mui/icons-material/Add";
import EuroIcon from "@mui/icons-material/Euro";
import TitleIcon from "@mui/icons-material/Title";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { FormEvent, useState } from "react";
import { useFocus } from "../shared/useFocus";
import { CategorySelector } from "./CategorySelector";

type TransactionType = "out" | "in";

interface AddFormProps {
  accounts: Account[];
  categories: Category[];
}

const defaultFormData = {
  out: { date: dayjs(), from: 1 },
  in: { date: dayjs() },
};

export const AddForm: React.FC<AddFormProps> = ({ accounts, categories }) => {
  const [formData, setFormData] = useState<Partial<NewTransaction>>(defaultFormData.out);
  const [type, setType] = useState<TransactionType>("out");
  const { inputRef, focus } = useFocus();
  const [error, setError] = useState("");

  const addTransaction = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.amount) return;

    const amount = type === "out" ? -formData.amount : formData.amount;
    const body = JSON.stringify({ ...formData, amount: amount });

    try {
      await customFetch("/api/transactions", { method: "POST", body });

      setError("");
      setType("out");
      setFormData({ ...defaultFormData.out, date: formData.date });

      focus();
    } catch (error) {
      console.log(error);

      setError((error as Error).toString());
    }
  };

  const changeHandler = <T,>(field: keyof NewTransaction, value: T) => setFormData({ ...formData, [field]: value });

  const handleTypeChange = (value: TransactionType) => {
    setType(value);
    setFormData(defaultFormData[value]);
  };

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
          onChange={(e: unknown, value: TransactionType) => value && handleTypeChange(value)}
          color="primary"
          size="small"
          exclusive
          fullWidth
        >
          <ToggleButton value="out">outgoing</ToggleButton>
          <ToggleButton value="in">incoming</ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
      {type === "out" && (
        <AccountSelector
          label="From"
          accounts={accounts}
          value={formData.from}
          onChange={(value: number) => changeHandler("from", value)}
        />
      )}
      {type === "in" && (
        <AccountSelector
          label="To"
          accounts={accounts}
          value={formData.to}
          onChange={(value: number) => changeHandler("to", value)}
        />
      )}
      <DatePicker
        label="Date"
        value={formData.date}
        onChange={(value) => changeHandler("date", value ?? dayjs())}
        format="DD-MM-YYYY"
        slotProps={{ textField: { fullWidth: true } }}
      />
      <TextField
        label="Description"
        fullWidth
        inputRef={inputRef}
        value={formData.description ?? ""}
        onChange={(e) => changeHandler("description", e.target.value)}
        InputProps={buildIconStartAdornment(<TitleIcon />)}
      />
      <TextField
        label="Amount"
        fullWidth
        value={formData.amount ?? ""}
        onChange={(e) => changeHandler("amount", Number(e.target.value))}
        type="number"
        InputProps={buildIconStartAdornment(<EuroIcon />)}
      />
      <CategorySelector
        fullWidth
        value={formData.category}
        onChange={(v) => changeHandler("category", v)}
        categories={categories}
      />
      <Button type="submit" variant="contained" startIcon={<AddIcon />} sx={{ maxWidth: 120 }}>
        Add
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
};

function buildIconStartAdornment(icon: React.ReactNode) {
  return {
    startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
  };
}
