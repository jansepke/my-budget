import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DateField } from "@mui/x-date-pickers";

export const AddForm = () => {
  const addTransaction = () => {
    fetch("/api/transactions", { method: "POST" });
  };

  return (
    <form onSubmit={addTransaction}>
      <DateField label="Date" format="DD-MM-YYYY" />
      <TextField label="Description" variant="outlined" />
      <TextField label="Amount" variant="outlined" type="number" />
      <br />
      <Button type="submit" variant="contained">
        Add
      </Button>
    </form>
  );
};
