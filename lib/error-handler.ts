import { FieldValues, UseFormReturn } from "react-hook-form";

export function handleFormError<T extends FieldValues>(
  error: any,
  form: UseFormReturn<T>
) {
  if (error?.response?.status === 422 && error?.response?.data?.errors) {
    const errors = error.response.data.errors;

    Object.keys(errors).forEach((field) => {
      form.setError(field as any, {
        type: "server",
        message: errors[field][0],
      });
    });
  } else {
    // Fallback error
    console.error("Unexpected error:", error);
  }
}
