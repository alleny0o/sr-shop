type SectionErrorProps = {
    message: string;
    height: number;
  };
  
  export const SectionError = ({ message, height }: SectionErrorProps) => {
    return (
      <div
        className="flex justify-center items-center text-center text-sm text-neutral-500 italic px-8"
        style={{ minHeight: `${height}px` }}
      >
        <p className="lg:max-w-3xl md:max-w-2xl sm:max-w-xl max-w-sm">
          {message} If you see this consistently, let Allen know.
        </p>
      </div>
    );
  };
  