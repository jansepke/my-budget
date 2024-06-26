import { useCategories } from "@/components/shared/CategoriesProvider";
import { Form } from "@/components/transactions/inputs/Form";
import { buildIconStartAdornment, useForm } from "@/components/transactions/inputs/util";
import { Transaction, TransactionWithRow } from "@/domain";
import { customFetch } from "@/utils";
import EuroIcon from "@mui/icons-material/Euro";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import TitleIcon from "@mui/icons-material/Title";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { CategorySelector } from "./inputs/CategorySelector";

interface EditFormProps {
  transaction: TransactionWithRow;
}

export const EditForm: React.FC<EditFormProps> = ({ transaction }) => {
  const { categories } = useCategories();

  const updateTransaction = async (formData: Partial<Transaction>) => {
    if (!formData.amount) return;

    const amount = Number(formData.amount.toString().replace(",", "."));
    const body = JSON.stringify({ ...formData, amount });

    await customFetch(`/api/transactions/${transaction.row}`, { method: "PUT", body });

    location.reload();
  };

  const { formData, isSaving, error, changeHandler, handleSubmit } = useForm<Partial<Transaction>>(
    transaction,
    updateTransaction,
  );

  return (
    <Form onSubmit={handleSubmit}>
      <DatePicker
        label="Date"
        value={formData.date}
        onChange={(value) => changeHandler("date", value ?? dayjs())}
        format="DD-MM-YYYY"
        slotProps={{ textField: { fullWidth: true } }}
        showDaysOutsideCurrentMonth
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
    </Form>
  );
};
