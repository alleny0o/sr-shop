interface AsideBackdropProps {
    onClose: () => void;
  }
  
  export function AsideBackdrop({ onClose }: AsideBackdropProps) {
    return (
      <div 
        className="absolute inset-0 bg-black/60" 
        onClick={onClose} 
      />
    );
  }