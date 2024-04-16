
"use client"

import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PaymentMethod } from "@/lib/model/paymentMethod";
import { Lightbulb } from "lucide-react";
import { useState } from "react";



export function Acknowledge({ orgId, paymentMethods }: { orgId: string, paymentMethods: PaymentMethod[] }) {

  const [openDialog, setOpenDialog] = useState<boolean>(false)

  if (typeof window !== undefined) {
    window.onbeforeunload = (e) => {
      e.preventDefault();
      setOpenDialog(true)
      return true
    }
  }

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acknowledgement</DialogTitle>
            <DialogDescription>
              Please let us know your preferred payment menthods
            </DialogDescription>
          </DialogHeader>
          <div>
            <Command>
              <CommandList>
                {
                  paymentMethods.map((method, idx) => {
                    return (
                      <CommandItem key={idx}>
                        {method.method_name}
                      </CommandItem>
                    )
                  })
                }
              </CommandList>
            </Command>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end">
        <Button
          onClick={() => setOpenDialog(true)}
          className="flex justify-center items-center gap-2"
        >
          <Lightbulb className="w-3 h-3" />
          Acknowledge request
        </Button>
      </div>
    </div>
  )
}




