'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot, } from "@/components/ui/input-otp"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { EmailAddressResource, PhoneNumberResource } from "@clerk/types"
import { useEffect, useState } from "react"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})


export type VerifyOTPFunction<R extends PhoneNumberResource | EmailAddressResource> = (code: string) => Promise<R>;
export type ResendOTPFunction<R extends PhoneNumberResource | EmailAddressResource> = () => Promise<R>;

type InputOTPFormProps<R extends PhoneNumberResource | EmailAddressResource> = {
  afterVerified?: Function
  verify?: VerifyOTPFunction<R>
  retryFunction?: ResendOTPFunction<R>
}

export function InputOTPForm<R extends PhoneNumberResource | EmailAddressResource>({
  afterVerified,
  verify,
  retryFunction
}: InputOTPFormProps<R>) {


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (verify !== undefined) {
      try {
        const result = await verify(data.pin)
        if (result == undefined) {
          toast({
            title: "Unexpected Error",
            description: "We cannot verify your otp now, please try it a gain."
          })
        } else if (result.verification!.status === "verified") {
          toast(
            {
              title: "OTP Verification Success",
              description: "Your OTP is verified!"
            }
          )
          setTimeout(() => {
            if (afterVerified !== undefined) {
              afterVerified()
            }
          }, 500);
        } else {
          toast(
            {
              title: "Wrong OTP",
              description: `Your OTP is ${result.verification!.status} , please try it again.`
            }
          )
        }
      } catch (e) {
        toast({
          title: "Unexpected Error",
          description: (e as Error).message
        })

      }
    }
  }

  const resendOTP = async () => {
    if (retryFunction !== undefined) {
      try {
        const result = await retryFunction()

        toast(
          {
            title: "Resend OTP",
            description: "Retry OTP is sent to you successfully!"
          }
        )
      } catch (e) {
        toast({
          title: "Unexpected Error",
          description: (e as Error).message
        })

      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription className={"w-full space-x-3"}>
                Please enter the one-time password sent to you.
                <OTPCounter expirationTime={new Date(Date.now() + 30 * 1000)} resendOTP={resendOTP} />
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}


type OTPFormPopupProps = {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  description: string
  afterVerified?: Function | undefined
  verify?: VerifyOTPFunction<EmailAddressResource | PhoneNumberResource>
  retryFunction?: ResendOTPFunction<EmailAddressResource | PhoneNumberResource>
}

export function OTPFormPopup(
  {
    open,
    onOpenChange,
    title,
    description,
    afterVerified,
    verify,
    retryFunction
  }: OTPFormPopupProps,
) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <InputOTPForm
          afterVerified={afterVerified}
          verify={verify}
          retryFunction={retryFunction} />
      </DialogContent>
    </Dialog>
  )
}


interface Props {
  expirationTime: Date;
  resendOTP: Function
}

const OTPCounter: React.FC<Props> = ({ expirationTime, resendOTP }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = () => {
    const difference = expirationTime.getTime() - new Date().getTime();
    let timeLeft = { hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const { hours, minutes, seconds } = timeLeft;

  const renderTime = () => {
    if (hours > 0) {
      return <span>{`${hours}h `}</span>
    } else if (minutes > 0) {
      return <span>{`${minutes}m `}</span>
    } else if (seconds > 0) {
      return <span>{`${seconds}s`}</span>
    }

    return <Button onClick={async () => {
      expirationTime = new Date(Date.now() + 30 * 1000)
      await resendOTP()
    }}
      variant={"link"}> resend </Button>
  }

  return (
    <>
      {renderTime()}
    </>
  );
};
