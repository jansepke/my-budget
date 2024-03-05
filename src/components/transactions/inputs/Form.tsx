import Stack from "@mui/material/Stack";
import { FormEvent } from "react";

interface FormProps extends React.PropsWithChildren {
  onSubmit: (e: FormEvent) => void;
}

export const Form: React.FC<FormProps> = ({ children, onSubmit }) => (
  <Stack
    component="form"
    noValidate
    autoComplete="off"
    onSubmit={onSubmit}
    justifyContent="center"
    alignItems="center"
    spacing={2}
  >
    {children}
  </Stack>
);
