import { memo } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { AppliedPersonalizationData, ParsedPersonalization } from '../types/personalization';

interface PersonalizationSummaryProps {
  appliedData: AppliedPersonalizationData;
  options: ParsedPersonalization[]; // Changed from personalization to options
  onEdit: () => void;
  onRemove: () => void;
}

export const PersonalizationSummary = memo(
  ({ appliedData, options, onEdit, onRemove }: PersonalizationSummaryProps) => {
    // Find the option that matches the applied type to get its label
    const selectedOption = options.find(opt => opt.key === appliedData.type);
    const typeLabel = selectedOption?.label || appliedData.type;
    
    return (
      <div className="border border-soft rounded-lg p-4">
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm font-semibold text-primary">Personalization Applied</span>
          <div className="flex items-center gap-3 text-xs uppercase">
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1 text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              <Edit3 size={14} />
              Edit
            </button>
            <span className="text-soft select-none">|</span>
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-1 text-muted hover:text-error-text transition-colors duration-0 cursor-pointer"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex">
            <span className="text-secondary w-16">Type:</span>
            <span className="text-primary capitalize">{typeLabel}</span>
          </div>

          {appliedData.text && (
            <div className="flex">
              <span className="text-secondary w-16">Text:</span>
              <span className="text-primary">"{appliedData.text}"</span>
            </div>
          )}

          {appliedData.font && (
            <div className="flex">
              <span className="text-secondary w-16">Font:</span>
              <span className="text-primary">{appliedData.font}</span>
            </div>
          )}

          {appliedData.position && (
            <div className="flex">
              <span className="text-secondary w-16">Position:</span>
              <span className="text-primary">{appliedData.position}</span>
            </div>
          )}

          {appliedData.image && appliedData.imagePreviewUrl && (
            <div className="flex items-center">
              <span className="text-secondary w-16">Image:</span>
              <img
                src={appliedData.imagePreviewUrl}
                alt="Applied image"
                className="max-w-60 max-h-60 object-cover rounded"
              />
            </div>
          )}
        </div>
      </div>
    );
  },
);

PersonalizationSummary.displayName = 'PersonalizationSummary';