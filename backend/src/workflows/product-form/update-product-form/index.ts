import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import updateProductFormStep, { UpdateProductFormStepInput} from "./steps/update-product-form";

type UpdateProductFormWorkflowInput = UpdateProductFormStepInput;

const updateProductFormWorkflow = createWorkflow(
    'update-product-form-workflow',
    (input: UpdateProductFormStepInput) => {
        const result = updateProductFormStep(input);

        return new WorkflowResponse(result);
    },
);

export default updateProductFormWorkflow;