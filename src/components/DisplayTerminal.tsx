import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Interpreter } from "../eval.js";
import { Alert } from "@/components/Alert";
import { Button } from "./ui/button";

export const DisplayTerminal = ({ code }: { code: string }) => {
  return (
    <div className={``}>
      <div className="display-window lg:w-50vw ">
        <div className="window__actions">
          <span className="window__actionButton window__actionButton--close"></span>
          <span className="window__actionButton window__actionButton--minimize"></span>
          <span className="window__actionButton window__actionButton--fullscreen"></span>
        </div>
        <div className="bg-[#f7edd9] h-full resize-none">
          <div className="h-full resize-none">{code}</div>
        </div>
      </div>
    </div>
  );
};
