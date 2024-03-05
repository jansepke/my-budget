import InputAdornment from "@mui/material/InputAdornment";
import { FormEvent, SetStateAction, useState } from "react";

const createChangeHandler =
  <R,>(setFormData: (value: SetStateAction<R>) => void) =>
  <T extends keyof R>(field: T, value: R[T]) =>
    setFormData((formData) => ({ ...formData, [field]: value }));

export const useForm = <T,>(initialFormData: T, onSubmit: (formData: T) => Promise<void>) => {
  const [formData, setFormData] = useState<T>(initialFormData);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const changeHandler = createChangeHandler(setFormData);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      await onSubmit(formData);

      setError("");
    } catch (error) {
      console.log(error);

      setError((error as Error).toString());
    } finally {
      setIsSaving(false);
    }
  };

  return { formData, setFormData, error, isSaving, changeHandler, handleSubmit };
};

export const buildIconStartAdornment = (icon: React.ReactNode) => ({
  startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
});
