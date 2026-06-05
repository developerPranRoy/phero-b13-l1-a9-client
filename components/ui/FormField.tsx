"use client";
import { TextField, Label, Input, FieldError } from "@heroui/react";
import { forwardRef } from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  fullWidth?: boolean;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, fullWidth = true, ...props }, ref) => {
    return (
      <TextField
        isInvalid={!!error}
        fullWidth={fullWidth}
        validationBehavior="aria"
      >
        <Label>{label}</Label>
        <Input ref={ref} {...props} />
        {error && <FieldError>{error}</FieldError>}
      </TextField>
    );
  }
);
FormField.displayName = "FormField";
export default FormField;
