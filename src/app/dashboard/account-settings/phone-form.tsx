import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";





const phoneNumberSchema = z.object({
  phone: z.string({
    required_error: "phone cannot be empty!"
  }).min(7, "Phone must be atleast 7 numbers")

})

type PhoneFormValues = z.infer<typeof phoneNumberSchema>

type OnSubmitFunction<T> = (data: T) => void;
type PhoneFormProps = {
  onSubmit: OnSubmitFunction<PhoneFormValues>
}
export function PhoneForm({ onSubmit }: PhoneFormProps) {

  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phone: ""
    }
  })

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phone"
            render={
              ({ field }) =>
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="+84897468382" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your phone number here and click submit when you are done.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
            }
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );

}





export function PhoneFormPopup({ children }: { children: ReactNode }) {

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          {children}
        </PopoverTrigger>
        <PopoverContent className="w-[350px] space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Add phone number</h4>
            <p className="text-sm text-muted-foreground">
              A text message containing a verification code will be sent to this phone number. Message and data rates may apply.
            </p>
          </div>
          <PhoneForm onSubmit={function(data: { phone: string; }): void {
            console.log(data) 
          }} />
        </PopoverContent>
      </Popover>

    </>

  );

}





