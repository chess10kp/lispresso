import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

const About = () => {
  return (
    <div className="flex flex-col items-center min-h-[80vh]">
      <h2 className="font-light text-center text-5xl m-10 ">About</h2>
      <div className="flex items-center gap-4">
        <SelfInfo
          name="Nitin M"
          src="/nitin-min.jpg"
          alt="@nitin"
          fallback="NM"
        />
        <SelfInfo name="Maria E" src="/maria.png" alt="@maria" fallback="ME" />
      </div>
    </div>
  );
};

const SelfInfo = ({
  name,
  src,
  alt,
  fallback,
}: {
  name: string;
  src: string;
  alt: string;
  fallback: string;
}) => {
  return (
    <>
      <div className="flex items-center flex-col m-6">
      <Avatar className="w-20 h-20">
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>NM</AvatarFallback>
      </Avatar>
        <h3 className="text-xl text-bold">{name}</h3>
        <p className="text-sm text-muted-foreground">
          <a className="text-muted-foreground text-md"></a>
        </p>
      </div>
    </>
  );
};

const ContactInfo = () => {
  return (
    <div className="flex justify-center gap-4 items-evenly">
      <svg
        width={20}
        height={20}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
      >
        <path
          fill="#fff"
          d="M232 152A72 72 0 1 0 88 152a72 72 0 1 0 144 0zm24 120l-12.6 0 10.7 80-48.4 0L195 272l-35 0-35 0-10.7 80-48.4 0 10.7-80L64 272c-13.3 0-24-10.7-24-24s10.7-24 24-24c-15.1-20.1-24-45-24-72C40 85.7 93.7 32 160 32s120 53.7 120 120c0 27-8.9 51.9-24 72c13.3 0 24 10.7 24 24s-10.7 24-24 24zM52.7 464l214.7 0-16.6-32L69.2 432 52.7 464zm207.9-80c12 0 22.9 6.7 28.4 17.3l26.5 51.2c3 5.8 4.6 12.2 4.6 18.7c0 22.5-18.2 40.8-40.8 40.8L40.8 512C18.2 512 0 493.8 0 471.2c0-6.5 1.6-12.9 4.6-18.7l26.5-51.2C36.5 390.7 47.5 384 59.5 384l201 0z"
        />
      </svg>
    </div>
  );
};

export default About;
