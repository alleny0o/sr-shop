type ProductHeaderProps = {
  title: string;
};

export const ProductTitle = ({ title }: ProductHeaderProps) => {
  if (!title) return null;

  return (
    <header>
      <h1 className="font-source-serif-4 text-3xl lg:text-4xl leading-tight break-words">{title}</h1>{' '}
    </header>
  );
};
