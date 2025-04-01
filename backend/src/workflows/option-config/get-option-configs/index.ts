import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import getOptionConfigsStep from "./steps/get-option-configs";

type GetOptionConfigsWorkflowInput = {
  product_id: string;
};

const getOptionConfigsWorkflow = createWorkflow("get-option-configs-workflow", (input: GetOptionConfigsWorkflowInput) => {
  const optionConfigs = getOptionConfigsStep({ product_id: input.product_id });
  return new WorkflowResponse(optionConfigs);
});

export default getOptionConfigsWorkflow;