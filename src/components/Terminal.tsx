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
    const output = [];
    for (const res of result) {
      if (res instanceof Error) {
        setMessage(res.message);
        setTitle("Error");
        return;
      }
      output.push(res.value);
    }
    setTitle("Output");
    setMessage(output.join("\n"));
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  return (
    <div className={`min-w-screen`}>
      <div className="window">
        <div className="window__actions">
          <span className="window__actionButton window__actionButton--close"></span>
          <span className="window__actionButton window__actionButton--minimize"></span>
          <span className="window__actionButton window__actionButton--fullscreen"></span>
        </div>
        <div>
          <div>
            <Textarea
              placeholder="code"
              className=" focus-visible:ring-0 shadow-none border-transparent focus:shadow-none text-black min-h-full focus:outline-none outline-none  ring-0  focus:border-transparent"
              onChange={(e) => setCode(e.target.value)}
              value={code}
            />
            <Button
              className="bg-[#f7edd9] right-0 absolute bottom-0 text-black hover:bg-[#f7edd9]"
              onClick={interpret}
            >
              Run
            </Button>
          </div>
        </div>
        <Alert message={message} title={title} time={0} />
      </div>
    </div>
  );
};
