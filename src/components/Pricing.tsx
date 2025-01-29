import {
  Card,
  CardHeader,
  CardDescription,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PricingProps = {};
export const Pricing = ({}: {}) => {
  return (
    <Card className="absolute top-[150px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
      <CardHeader>
        <CardTitle className="flex item-center justify-between">
          Free
          <Badge variant="secondary" className="text-sm text-primary">
            Most popular
          </Badge>
        </CardTitle>
        <div>
          <span className="text-3xl font-bold">$0</span>
          <span className="text-muted-foreground"> /month</span>
        </div>

        <CardDescription>
          Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button className="w-full">Start Free Trial</Button>
      </CardContent>

      <hr className="w-4/5 m-auto mb-4" />

      <CardFooter className="flex">
        <div className="space-y-4">
          {["4 Team member", "4 GB Storage", "Upto 6 pages"].map(
            (benefit: string) => (
              <span key={benefit} className="flex">
                <h3 className="ml-2">{benefit}</h3>
              </span>
            ),
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
