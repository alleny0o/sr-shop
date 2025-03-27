type SectionLoaderProps = {
    height: number;
  };
  
  export const SectionLoader = ({ height }: SectionLoaderProps) => {
    return (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: `${height}px` }}
      >
        <div className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin aspect-square w-10 flex justify-center items-center text-yellow-700" />
      </div>
    );
  };
  