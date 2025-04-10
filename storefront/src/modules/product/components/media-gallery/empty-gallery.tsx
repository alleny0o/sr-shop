import { Container } from "@medusajs/ui"

const EmptyGallery = () => {
  return (
    <Container className="relative aspect-[3/2] w-full overflow-hidden bg-ui-bg-subtle">
      <div className="flex items-center justify-center h-full text-ui-fg-subtle">
        No medias available
      </div>
    </Container>
  )
}

export default EmptyGallery
