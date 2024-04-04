"use client"

import {useState} from "react"
import {ColumnDef,} from "@tanstack/react-table"
import {ArrowUpDown, Edit, MoreHorizontal, PlusCircle, Send, Trash2} from "lucide-react"

import {Button} from "@/components/ui/button"
import Contact from "@/lib/model/contact";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import ContactForm from "@/app/dashboard/contacts/components/contact-form";
import {createContact, deleteContact, updateContact} from "@/lib/actions/contactAction"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import DataTable from "@/components/DataTable";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {useToast} from "@/components/ui/use-toast";


interface ContactDataTableProps {
    contacts: Contact[]
}


export default function ContactTable(
    {
        contacts,
    }: ContactDataTableProps,
) {


    const [createFormDialog, setCreateFormDialog] = useState(false)
    const [updateFormDialog, setUpdateFormDialog] = useState(false)
    const [selectedContact, setSelectedContact] = useState<Contact>()
    const [deleteContactDialog, setDeleteContactDialog] = useState(false)
    const columns: ColumnDef<Contact>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({row}) => (
                <div>{row.getValue("name")} </div>
            ),
        },
        {
            accessorKey: "company_name",
            header: "Company",
            cell: ({row}) => {
                return (
                    <div>{row.getValue("company_name")}</div>
                )
            },
        },
        {
            accessorKey: "email",
            header: ({column}) => {
                return (
                    <Button
                        variant="ghost"
                        className="items-start px-0"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                )
            },
            cell: ({row}) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({row}) => {
                return <div>{row.getValue('phone')}</div>
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({row}) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                className="flex gap-2"
                                onClick={() => {
                                    setSelectedContact(row.original)
                                    setUpdateFormDialog(true)
                                }}>
                                <Edit className="h-4 w-4"/>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex gap-2 ">
                                <Send className="h-4 w-4"/>
                                Request Pay
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setDeleteContactDialog(true);
                                    setSelectedContact(row.original);
                                }}
                                className="flex gap-2 text-red-500"
                            >
                                <Trash2 className="h-4 w-4" color="#ef4444"/>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const {toast} = useToast()

    async function onDeleteContact() {
        const result = await deleteContact(selectedContact!.id!);
        const {error, data} = result;
        if (error === undefined) {
            toast(
                {
                    variant: "default",
                    title: "Success",
                    description: "Contact is deleted!",
                }
            )
        } else {
            toast(
                {
                    variant: "destructive",
                    title: "Error",
                    description: error,
                }
            )
        }
    }

    return (
        <div className="w-full">
            <Dialog open={updateFormDialog} onOpenChange={setUpdateFormDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update</DialogTitle>
                        <DialogDescription>
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            Update Contact information here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <ContactForm
                        key={2}
                        open={updateFormDialog}
                        onOpenChange={setUpdateFormDialog}
                        updateAction={updateContact}
                        isUpdateForm={true}
                        defaultValues={selectedContact}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteContactDialog} onOpenChange={setDeleteContactDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure to delete the contact?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the contact from database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onDeleteContact}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DataTable
                columns={columns}
                data={contacts}
                actions={[
                    (<div key={1} className="flex gap-4">
                        <Dialog open={createFormDialog} onOpenChange={setCreateFormDialog}>
                            <DialogTrigger asChild>
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                  <Button
                                      size="sm"
                                      className="h-8 gap-1"
                                  >
                                <PlusCircle className="h-3.5 w-3.5"/>
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                  Add Contact
                                </span>
                            </Button>
                                </span>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>New Contact</DialogTitle>
                                    <DialogDescription>
                                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                                        Add new contact information here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <ContactForm
                                    key={1}
                                    createAction={createContact}
                                    isUpdateForm={false}
                                    onOpenChange={setCreateFormDialog}
                                    open={createFormDialog}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>)
                ]}
                searchColumn={"email"}
            />
        </div>
    )
}
