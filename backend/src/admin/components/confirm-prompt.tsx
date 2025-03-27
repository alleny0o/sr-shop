// UI Components
import { Prompt, Button } from "@medusajs/ui";

type ConfirmPromptProps = {
    title: string;
    description: string;
    open: boolean;
    onClose: (value: boolean) => void;
    onConfirm: () => void;
    onCancel: () => void;
};

export const ConfirmPrompt = (input: ConfirmPromptProps) => {
    const { title, description, open, onClose, onConfirm, onCancel } = input;

    return (
        <Prompt open={open} onOpenChange={onClose}>
            <Prompt.Content>
                <Prompt.Header>
                    <Prompt.Title>{title}</Prompt.Title>
                    <Prompt.Description>{description}</Prompt.Description>
                </Prompt.Header>
                <Prompt.Footer>
                    <Button size="small" variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button size="small" variant="primary" onClick={onConfirm}>
                        Continue
                    </Button>
                </Prompt.Footer>
            </Prompt.Content>
        </Prompt>
    );
};