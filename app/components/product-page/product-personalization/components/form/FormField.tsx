interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
}

export const FormField = ({
  label,
  required,
  error,
  helpText,
  children,
  footer,
  headerAction,
  className,
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <div>
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-primary font-inter">
            {label}
            {required && <span className="text-error-text ml-px font-inter">*</span>}
          </label>
          {headerAction}
        </div>
        {helpText && <p className="text-xs font-normal text-secondary font-inter">{helpText}</p>}
      </div>
      <div className={className}>
        {children}
        <div className="flex justify-between items-center">
          {error ? <p className="text-xs text-error-text font-inter">{error}</p> : <div></div>}
          {footer}
        </div>
      </div>
    </div>
  );
};
