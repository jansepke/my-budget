import { useCategories } from "@/components/shared/CategoriesProvider";
import { AccountSelector } from "@/components/transactions/inputs/AccountSelector";
import { Form } from "@/components/transactions/inputs/Form";
import { buildIconStartAdornment, useForm } from "@/components/transactions/inputs/util";
import { Account, Transaction } from "@/domain";
import { customFetch } from "@/utils";
import AddIcon from "@mui/icons-material/Add";
import EuroIcon from "@mui/icons-material/Euro";
import TitleIcon from "@mui/icons-material/Title";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useState } from "react";
import { useFocus } from "../shared/useFocus";
import { CategorySelector } from "./inputs/CategorySelector";

type TransactionType = "out" | "in";

interface AddFormProps {
  accounts: Account[];
  uniqueDescriptions: string[];
}

const defaultFormData = {
  out: { date: dayjs(), from: 1 },
  in: { date: dayjs() },
};

export const AddForm: React.FC<AddFormProps> = ({ accounts, uniqueDescriptions }) => {
  const { categories } = useCategories();
  const [type, setType] = useState<TransactionType>("out");
  const { inputRef, focus } = useFocus();

  const addTransaction = async (formData: Partial<Transaction>) => {
    if (!formData.amount) return;

    const amount = Number(formData.amount.toString().replace(",", "."));
    const body = JSON.stringify({ ...formData, amount: type === "out" ? -amount : amount });

    await customFetch("/api/transactions", { method: "POST", body });
    setType("out");
    setFormData({ ...defaultFormData.out, date: formData.date });

    focus();
  };

  const { formData, setFormData, isSaving, error, changeHandler, handleSubmit } = useForm<Partial<Transaction>>(
    defaultFormData.out,
    addTransaction,
  );

  const handleTypeChange = (value: TransactionType) => {
    setType(value);
    setFormData({ ...defaultFormData[value], date: formData.date });
  };

  return (
    <Form onSubmit={handleSubmit}>
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
        showDaysOutsideCurrentMonth
      />
      <Autocomplete
        renderInput={(params) => (
          <TextField
            {...params}
            ref={inputRef}
            label="Description"
            InputProps={{ ...params.InputProps, ...buildIconStartAdornment(<TitleIcon />) }}
          />
        )}
        value={formData.description ?? ""}
        autoSelect
        onChange={(e, c) => changeHandler("description", c ?? "")}
        options={uniqueDescriptions}
        selectOnFocus
        freeSolo
        fullWidth
      />
      <TextField
        label="Amount"
        fullWidth
        inputProps={{ inputMode: "decimal" }}
        value={formData.amount ?? ""}
        onChange={(e) => changeHandler("amount", e.target.value as unknown as number)}
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
    </Form>
  );
};
