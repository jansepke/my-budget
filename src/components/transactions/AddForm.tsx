import { useCategories } from "@/components/shared/CategoriesProvider";
import { AccountSelector } from "@/components/transactions/AccountSelector";
import { Account, NewTransaction } from "@/domain";
import { customFetch } from "@/utils";
import AddIcon from "@mui/icons-material/Add";
import EuroIcon from "@mui/icons-material/Euro";
import TitleIcon from "@mui/icons-material/Title";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
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
}

const defaultFormData = {
  out: { date: dayjs(), from: 1 },
  in: { date: dayjs() },
};

// TODO: refactor with EditForm
export const AddForm: React.FC<AddFormProps> = ({ accounts }) => {
  const { categories } = useCategories();
  const [formData, setFormData] = useState<Partial<NewTransaction>>(defaultFormData.out);
  const [type, setType] = useState<TransactionType>("out");
  const { inputRef, focus } = useFocus();
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const addTransaction = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.amount) return;

    const amount = Number(formData.amount.toString().replace(",", "."));
    const body = JSON.stringify({ ...formData, amount: type === "out" ? -amount : amount });

    try {
      setIsSaving(true);
      await customFetch("/api/transactions", { method: "POST", body });

      setError("");
      setType("out");
      setFormData({ ...defaultFormData.out, date: formData.date });

      focus();
    } catch (error) {
      console.log(error);

      setError((error as Error).toString());
    } finally {
      setIsSaving(false);
    }
  };

  // TODO: fix value type not matching field type
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
        inputProps={{ inputMode: "decimal" }}
        value={formData.amount ?? ""}
        onChange={(e) => changeHandler("amount", e.target.value)}
        InputProps={buildIconStartAdornment(<EuroIcon />)}
      />
      <CategorySelector
        fullWidth
        value={formData.category}
        onChange={(v) => changeHandler("category", v?.value)}
        categories={categories}
      />
      <LoadingButton
        type="submit"
        variant="contained"
        startIcon={<AddIcon />}
        loading={isSaving}
        loadingPosition="start"
        sx={{ maxWidth: 120 }}
      >
        Add
      </LoadingButton>
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
};

function buildIconStartAdornment(icon: React.ReactNode) {
  return {
    startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
  };
}
