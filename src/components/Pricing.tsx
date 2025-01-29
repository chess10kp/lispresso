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
    <div className="flex space-x-4 lg:space-x-8 justify-evenly mt-4">
      <Card className="top-[150px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
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
            Free forever, for students
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full text-black bg-[#f7edd9]">Sign up</Button>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {[
              "All free lessons",
              "Limited Repl Usage",
              "Discussion Board access",
            ].map((benefit: string) => (
              <span key={benefit} className="flex">
                <h3 className="ml-2">{benefit}</h3>
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>

      <Card className="top-[150px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            Commercial
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">$200</span>
            <span className="text-muted-foreground"> /year</span>
          </div>

          <CardDescription>
            Learn as much as you desire
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full text-black bg-[#f7edd9]">Sign up</Button>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {[
              "All premium lessons",
              "Unlimited Repl Usage",
              "Additional premium content",
            ].map((benefit: string) => (
              <span key={benefit} className="flex">
                <h3 className="ml-2">{benefit}</h3>
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>

      <Card className="top-[150px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            Business
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">$500</span>
            <span className="text-muted-foreground"> /week</span>
          </div>

          <CardDescription>
            Accelerate your Clojure adoption
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full text-black bg-[#f7edd9]">Sign up</Button>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {[
              "All premium Lessons",
              "Week long bootcamps from our experts",
            ].map((benefit: string) => (
              <span key={benefit} className="flex">
                <h3 className="ml-2">{benefit}</h3>
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
