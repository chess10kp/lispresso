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
    <div>
      {title && message && (
        <Al>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Al>
      )}
    </div>
  );
};
