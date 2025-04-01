// UI Components
import { Container, Heading, Tooltip } from "@medusajs/ui";
import { InformationCircle } from "@medusajs/icons";

type SectionWrapperProps = {
  heading: string;
  children: React.ReactNode;
  component?: React.ReactNode;
  tooltip?: string;
};

export const SectionWrapper = (input: SectionWrapperProps) => {
  const { heading, children, component, tooltip } = input;

  return (
    <>
      <Container className="divide-y p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">{heading}</Heading>
          {tooltip ? (
            <Tooltip content={tooltip}>
              <InformationCircle />
            </Tooltip>
          ) : (
            <>{component}</>
          )}
        </div>
        {children}
      </Container>
    </>
  );
};
