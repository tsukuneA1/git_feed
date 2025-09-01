import Image from "next/image";

interface userIconProps {
  src: string;
}

export const userIcon = ({ src }: userIconProps) => {
  return (
    <Image
      src={src}
      alt="Image of userIcon"
      width={100}
      height={100}
      className="rounded-full"
    />
  );
};