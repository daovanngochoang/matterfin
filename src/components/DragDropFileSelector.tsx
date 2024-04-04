import React, {ReactNode} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Card} from "@/components/ui/card";
import {CloudUpload} from "lucide-react";
import {Input} from "@/components/ui/input";


type HandleDropEvent = (event: React.DragEvent<HTMLDivElement>) => void;
type HandleOnSelectEvent = (event: React.ChangeEvent<HTMLInputElement>) => void;

type DragFileSelectorProps = {
    open: boolean
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
    handleDrop: HandleDropEvent
    handleSelect: HandleOnSelectEvent
    children: ReactNode
}

export default function DragDropFileSelector(
    {
        open,
        onOpenChange,
        handleDrop,
        handleSelect,
        children
    }: DragFileSelectorProps) {

    function allowDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
    }

    function handleDropEvent(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        handleDrop(event)
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>
                    {children}
                    {/* <Button onClick={() => onOpenChange(true)} variant="link" className="h-5 pl-0"> */}
                    {/*     Choose logo */}
                    {/* </Button> */}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Select Logo</DialogTitle>
                        <DialogDescription>
                            Drag and Drop or click select to select the image.
                        </DialogDescription>
                    </DialogHeader>
                    <Card>
                        <div onDrop={handleDropEvent} onDragOver={allowDrop}
                             className="w-full h-32 flex justify-center items-center ">
                            <CloudUpload className="w-16 h-16 opacity-60"/>
                        </div>
                    </Card>
                    <DialogFooter>
                        <Input type="file" onChange={handleSelect}/>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

