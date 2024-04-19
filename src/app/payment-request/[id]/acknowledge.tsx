
"use client"

import { Button } from "@/components/ui/button";
import { Command, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { acknowledgeRequest, updatePaymentRequest } from "@/lib/actions/paymentRequestAction";
import { PaymentMethod } from "@/lib/model/paymentMethod";
import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { PaymentRequest } from "@/lib/model/paymentRequest";


export function Acknowledge({ orgId, paymentMethods, pr }: { orgId: string, paymentMethods: PaymentMethod[], pr: PaymentRequest }) {

  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [isAcknowledged, setIsAcknowledged] = useState<boolean>(pr.is_acknowledged ?? false)


  useEffect(
    () => {
      if (!isAcknowledged && typeof window !== undefined) {
        window.onbeforeunload = (e) => {
          e.preventDefault();
          setOpenDialog(true)
          return true
        }
      } else {
        window.onbeforeunload = null;
      }
    }, [isAcknowledged]
  )


  const acknowledge = async (methodId: number) => {
    try {
      const updatedData = await acknowledgeRequest(pr.id!, orgId,  methodId);
      if (updatedData.error === undefined) {
        toast({
          title: "Acknowledgement",
          description: "You successfully let them know you acknowledge the payment"
        })
        pr.payment_method_id = methodId;
        setIsAcknowledged(true)
        setOpenDialog(false)
        return
      }
      toast({
        title: "Error",
        description: updatedData.error,
        variant: "destructive"
      })
    } catch (e) {
      toast({
        title: "Error",
        description: (e as Error).message,
        variant: "destructive"
      })
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
                      <div
                        key={idx}
                        className={`pl-2 text-sm flex items-center gap-3 rounded-lg px-3 py-2 hover:cursor-pointer hover:bg-muted text-muted-foreground ${isAcknowledged && pr.payment_method_id == method.id ? "bg-muted text-primary" : ""} `}
                        onClick={() => acknowledge(method.id!)}>
                        {method.method_name}
                      </div>
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




