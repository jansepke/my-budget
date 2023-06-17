import { Account } from "@/domain";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

interface AccountSelectorProps {
  accounts: Account[];
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({ accounts, label, value, onChange }) => (
  <FormControl fullWidth>
    <FormLabel>{label}</FormLabel>
    <ToggleButtonGroup
      value={value}
      onChange={(e: unknown, value: number) => value && onChange(value)}
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
);
