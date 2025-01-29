import Image from "next/image";

type LogoProps = {};
export const Logo = ({}: LogoProps) => {
  return (
    <div>
      <Image
        className="logo"
        alt="logo"
        width={4}
        height={5}
        src="/official_logo.png"
      />
    </div>
  );
};
