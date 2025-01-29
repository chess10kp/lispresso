import {
  Alert as Al,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";

export const Alert = ({
  title,
  message,
  time,
}: {
  title: string;
  message: string;
  time: number;
}) => {
  return (
    <div className="min-w-fit absolute left-0 bottom-0 border-0 outline-0 rounded-none max-w-fit bg-[#f7edd9]">
      {title && message && (
        <Al className="bottom-0 border-0 outline-0 rounded-none bg-[#f7edd9] rounded-lg" >
          <AlertTitle className="bg-[#f7edd9] ">{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Al>
      )}
    </div>
  );
};
