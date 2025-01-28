import { Textarea } from "@/components/ui/textarea"

export const Terminal = () => {
  return (
    <div className={`bg-[#f7edd9] mx-10 min-w-screen`}>
      <div className="window">
        <div className="window__actions">
          <span className="window__actionButton window__actionButton--close"></span>
          <span className="window__actionButton window__actionButton--minimize"></span>
          <span className="window__actionButton window__actionButton--fullscreen"></span>
        </div>
        <Textarea placeholder="code" className="border-0 window__content">
        </Textarea>
      </div>
    </div>
  );
};
