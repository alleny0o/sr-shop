import { create } from "zustand"
import { EnrichedVariant } from "types/global"

type ProductOptionsState = {
  options: Record<string, string | undefined>
  selectedVariant?: EnrichedVariant
  setOption: (optionId: string, value: string) => void
  setAllOptions: (newOptions: Record<string, string | undefined>) => void
  setSelectedVariant: (variant: EnrichedVariant | undefined) => void
  resetOptions: () => void
}

export const useProductOptionsStore = create<ProductOptionsState>((set) => ({
  options: {},
  selectedVariant: undefined,
  setOption: (optionId, value) =>
    set((state) => ({
      options: {
        ...state.options,
        [optionId]: value,
      },
    })),
  setAllOptions: (newOptions) => set({ options: newOptions }),
  setSelectedVariant: (variant) => set({ selectedVariant: variant }),
  resetOptions: () => set({ options: {}, selectedVariant: undefined }),
}))
