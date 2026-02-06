import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RecruitModal } from "@/components/site/RecruitModal";

export default function RecruitButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} className="shadow-glow">Me recruter</Button>
      <RecruitModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
