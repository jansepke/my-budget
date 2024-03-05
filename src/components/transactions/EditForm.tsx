import { useCategories } from "@/components/shared/CategoriesProvider";
import { buildIconStartAdornment, useForm } from "@/components/transactions/inputs/util";
import { TransactionWithRow, UpdateTransaction } from "@/domain";
import { customFetch, parseGoogleSheetsDate } from "@/utils";
import EuroIcon from "@mui/icons-material/Euro";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import TitleIcon from "@mui/icons-material/Title";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { CategorySelector } from "./inputs/CategorySelector";

interface EditFormProps {
  transaction: TransactionWithRow;
}

// TODO: refactor with AddForm
export const EditForm: React.FC<EditFormProps> = ({ transaction }) => {
  const { categories } = useCategories();

  const addTransaction = async (formData: Partial<UpdateTransaction>) => {
    if (!formData.amount) return;

    const amount = Number(formData.amount.toString().replace(",", "."));
    const body = JSON.stringify({ ...formData, amount });

    await customFetch(`/api/transactions/${transaction.row}`, { method: "PUT", body });

    location.reload();
  };

  const { formData, isSaving, error, changeHandler, handleSubmit } = useForm<Partial<UpdateTransaction>>(
    { ...transaction, date: dayjs(parseGoogleSheetsDate(transaction.date)) },
    addTransaction,
  );

  return (
    <Stack
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
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
        value={formData.description ?? ""}
        onChange={(e) => changeHandler("description", e.target.value)}
        InputProps={buildIconStartAdornment(<TitleIcon />)}
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
        startIcon={<SaveAltIcon />}
        loading={isSaving}
        loadingPosition="start"
        sx={{ maxWidth: 120 }}
      >
        Save
      </LoadingButton>
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
};
