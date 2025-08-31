import Image from "next/image";

interface userIconProps {
  source: string;
}

const userIcon = ({ source }: userIconProps) => {
  return (
    <Image
      src={source}
      alt="Image of userIcon"
      width={100}
      height={100}
      className="rounded-full"
    />
  );
};

export default userIcon;
