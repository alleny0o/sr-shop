type CartAsideCTAProps = {
  text: string;
  bgColor?: string;
  textColor?: string;
};

export const CartAsideCTA = ({ text, bgColor = 'bg-blue-100', textColor = 'text-black' }: CartAsideCTAProps) => {
  return (
    <div className={`px-2 py-1.5 ${bgColor}`}>
      <p className={`font-inter md:text-sm text-[13px] ${textColor}`}>{text}</p>
    </div>
  );
};
