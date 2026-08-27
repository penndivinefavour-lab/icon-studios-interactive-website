import Image from 'next/image';

type ImageWrapperProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

export const ImageWrapper = ({ src, alt, className = '', width = 800, height = 600 }: ImageWrapperProps) => {
  return (
    <div className={`overflow-hidden rounded-xl bg-border/60 ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="block h-auto w-full object-cover"
        loading="lazy"
      />
    </div>
  );
};
