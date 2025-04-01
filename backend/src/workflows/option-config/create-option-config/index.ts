import { createWorkflow, WorkflowResponse, when } from "@medusajs/framework/workflows-sdk";
import createOptionConfigStep from "./steps/create-option-config";
import createOptionValuesStep from "./steps/create-option-values";
import createRemoteLinkStep from "./steps/create-link";

export type CreateOptionConfigWorkflowInput = {
  product_id: string;
  option_id: string;
  option_title: string;
  is_selected: boolean;
  option_value_ids: string[];
};

const createOptionConfigWorkflow = createWorkflow("create-option-config-workflow", (input: CreateOptionConfigWorkflowInput) => {
  // create the Option Config and get it back
  const optionConfig = createOptionConfigStep({
    product_id: input.product_id,
    option_id: input.option_id,
    option_title: input.option_title,
    is_selected: input.is_selected,
  });

  // create the remote link between the product option and the Option Config
  createRemoteLinkStep({
    product_option_id: input.option_id,
    option_config_id: optionConfig.id,
  });

  when({ input }, ({ input }) => input.option_value_ids.length > 0).then(() => {
    createOptionValuesStep({
      option_config_id: optionConfig.id,
      option_value_ids: input.option_value_ids,
    });
  });

  return new WorkflowResponse(optionConfig);
});

export default createOptionConfigWorkflow;