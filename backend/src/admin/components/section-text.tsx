type SectionTextProps = {
    message: string;
    icon?: React.ReactNode;
    height: number;
  };
  
  export const SectionText = ({ message, icon, height }: SectionTextProps) => {
    return (
      <div
        className="flex justify-center items-center text-center text-sm text-neutral-500 italic px-8"
        style={{ minHeight: `${height}px` }}
      >
        <p className="flex items-center gap-x-1 lg:max-w-3xl md:max-w-2xl sm:max-w-xl max-w-sm">
          {message}
          {icon}
        </p>
      </div>
    );
  };
  