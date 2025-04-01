import { createContext, useContext } from "react";
import { OptionConfig } from "../types";

export const OptionConfigsContext = createContext<OptionConfig[] | undefined>(undefined);

export function useOptionConfigsContext() {
    const option_uis = useContext(OptionConfigsContext);

    if (option_uis === undefined) {
        throw new Error("useOptionUIsContext must be used within a OptionUIsContext");
    }

    return option_uis;
};