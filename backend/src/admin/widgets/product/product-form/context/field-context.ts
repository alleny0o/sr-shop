import { createContext, useContext } from "react";

import { UseFormReturn } from "react-hook-form";
import { Form } from "../types";

export type FieldContextType = {
  idx: number;
  remove: () => void;
  form: UseFormReturn<Form, any, undefined>;
};

export const FieldContext = createContext<FieldContextType | undefined>(undefined);

export function useFieldContext() {
  const formField = useContext(FieldContext);

  if (formField === undefined) {
    throw new Error("useFieldContext must be used within a FieldContext");
  }

  return formField;
}
