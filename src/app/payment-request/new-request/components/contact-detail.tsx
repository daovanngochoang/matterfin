"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import Contact from "@/lib/model/contact"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { CommandList } from "cmdk"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { UseFormReturn, useForm } from "react-hook-form"
import { z } from "zod"



const PRContactDetailFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  company: z.string(),
  phone: z.string().regex(new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
  ), "Invalid phone number"),
  email: z.string().email({
    message: "Invalid email addresss"
  })

})


export type PRContactDetailSchemaType = z.infer<typeof PRContactDetailFormSchema>


type PRContactDetailFormProps = {
  onChanged: (contact: Contact | undefined, form: UseFormReturn<PRContactDetailSchemaType>) => void,
  contacts: Contact[],
  defaultData: Contact
}


export function PRContactDetailForm({ contacts, onChanged, defaultData }: PRContactDetailFormProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact>()
  const [selected, setSelected] = useState(false)
  const searchParams = useSearchParams()

  const contactId = searchParams.get('contact_id')
  let defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: ""
  }

  if (defaultData !== undefined && defaultData.id === undefined) {
    defaultValues.lastName = defaultData.lastname
    defaultValues.firstName = defaultData.firstname
    defaultValues.email = defaultData.email
    defaultValues.phone = defaultData.phone
    defaultValues.company = defaultData.company_name
  } else {
    if (defaultData !== undefined && selectedContact === undefined) {
      setValue(defaultData.name!)
      setSelectedContact(defaultData)
      setSelected(true)
    }
  }

  const form = useForm<PRContactDetailSchemaType>({
    resolver: zodResolver(PRContactDetailFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: ""
    },
  })

  console.log(contacts)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Send payment request to</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {value
                ? contacts.find((contact) => contact.name === value)?.name
                : "Select contact..."}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[550px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandEmpty>No Contact found.</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {contacts.map((ct) => (
                    <CommandItem
                      key={ct.id}
                      value={ct.name}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                        setSelectedContact(ct)
                        onChanged(ct, form)
                        setSelected(true)
                      }}
                    >
                      {ct.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === ct.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

      </div>
      {
        selected
          ? <Button
            variant={"outline"}
            onClick={() => {
              setSelected(false)
              setValue("")
              form.reset()
            }}
          >Set values</Button>
          : <Form {...form} >
            <form
              className="space-y-4"
              onChange={
                () => {
                  onChanged(selectedContact, form)
                }
              }>
              <div className="flex w-full justify-between gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Firstname</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter firstname here" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Lastname</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter lastname here" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
      }
    </div>
  )
}






