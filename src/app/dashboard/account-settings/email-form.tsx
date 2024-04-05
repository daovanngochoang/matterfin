
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";





const emailSchema = z.object({
  email: z.string({
    required_error: "Email cannot be empty!"
  }).email("imvalid email address!").min(7, "Email must be atleast 7 numbers")

})

type EmailFormValues = z.infer<typeof emailSchema>

type OnSubmitFunction<T> = (data: T) => void;

type EmailFormProps = {
  onSubmit: OnSubmitFunction<EmailFormValues>
}
export function PhoneForm({ onSubmit }: EmailFormProps) {

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ""
    }
  })

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={
              ({ field }) =>
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="matterfin@gmail.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter new email here and click submit when you're done.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
            }
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );

}




export function EmailFormPopup({ children }: { children: ReactNode }) {

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          {children}
        </PopoverTrigger>
        <PopoverContent className="w-[350px] space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Add email address</h4>
            <p className="text-sm text-muted-foreground">
              An email containing a verification code will be sent to this email address.
            </p>
          </div>
          <PhoneForm onSubmit={function(data: { email: string; }): void {
            console.log(data)
          }} />
        </PopoverContent>
      </Popover>

    </div>

  );

}
