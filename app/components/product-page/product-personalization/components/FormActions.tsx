import { memo } from 'react';

interface FormActionsProps {
  onCancel: () => void;
  onApply: () => void;
}

export const FormActions = memo(({ onCancel, onApply }: FormActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-soft">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm text-secondary hover:text-primary transition-colors duration-0 font-inter cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onApply}
        className="px-4 py-2 text-sm bg-bronze-light text-primary hover:bg-bronze-medium transition-colors duration-0 font-inter cursor-pointer"
      >
        Apply
      </button>
    </div>
  );
});

FormActions.displayName = 'FormActions';
