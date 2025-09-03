export interface BaseFormFieldProps {
    label: string;
    name: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
    helpText?: string;
  }
  
  export interface SelectOption {
    value: string;
    label: string;
  }
  
  export interface RadioOption {
    value: string;
    label: string;
    description?: string;
  }
  