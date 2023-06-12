import EuroIcon from "@mui/icons-material/Euro";
import EventIcon from "@mui/icons-material/Event";
import TitleIcon from "@mui/icons-material/Title";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { DateField } from "@mui/x-date-pickers";

export const AddForm = () => {
  const addTransaction = () => {
    fetch("/api/transactions", { method: "POST" });
  };

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
          format="DD-MM-YYYY"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EventIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Description"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TitleIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Amount"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EuroIcon />
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
      <Button type="submit" variant="contained" startIcon={<AddIcon />}>
        Add
      </Button>
    </Box>
  );
};
