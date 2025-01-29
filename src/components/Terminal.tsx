import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Interpreter } from "../eval.js";
import { Alert } from "@/components/Alert";
import { Button } from "./ui/button";

export const Terminal = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const interpreter = new Interpreter();

  const interpret = () => {
    if (!code) return;
    const result = interpreter.eval(code);
    for (const res of result) {
      if (res instanceof Error) {
      setMessage(res.message);
      setTitle("Output");
      return;
      }
    }
    console.log(result);
  };

  return (
    <div className={`bg-[#f7edd9]  min-w-screen`}>
      <div className="window">
        <div className="window__actions">
          <span className="window__actionButton window__actionButton--close"></span>
          <span className="window__actionButton window__actionButton--minimize"></span>
          <span className="window__actionButton window__actionButton--fullscreen"></span>
        </div>
        <Textarea
          placeholder="code"
          className=" focus-visible:ring-0 text-black min-h-full focus:outline-none focus:ring-0 focus:border-transparent"
          onChange={(e) => setCode(e.target.value)}
          value={code}
        />
        <Button
          className="bg-[#f7edd9] text-black hover:bg-[#f7edd9]"
          onClick={interpret}
        >
          Run
        </Button>
      </div>
      <Alert message={message} title={title} time={0} />
    </div>
  );
};
