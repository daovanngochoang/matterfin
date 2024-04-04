import * as React from "react";
import {useState} from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    Table,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {Table as CustomUITable, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Input} from "@/components/ui/input";

type SetTable<T> = (table: Table<T>) => void;

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[];
    setTable?: SetTable<TData>;
    actions?: React.ReactNode[]
    searchColumn: string
}


export default function DataTable<TData, TValue>(
    {
        columns,
        data,
        setTable,
        actions,
        searchColumn
    }: DataTableProps<TData, TValue>,
) {

    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 10, //page size
    });


    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        rowCount: data.length,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination
        },
    })

    if (setTable !== undefined) {
        setTable(table)
    }

    return (
        <div className="w-full">

            <div className="flex items-center py-4 justify-between">
                {
                    searchColumn !== undefined ?
                        <Input
                            placeholder={`Filter ${searchColumn}s...`}
                            value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn(searchColumn)?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        /> :
                        <></>
                }
                <div className="flex gap-4">
                    {actions !== undefined ? actions.map((action, key) => (<div key={key}>{action}</div>)) : []}
                </div>

            </div>
            <div className="rounded-md border">
                <CustomUITable>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </CustomUITable>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                {/*<div className="flex-1 text-sm text-muted-foreground">*/}

                {/*    {table.getPaginationRowModel().rows.length} of{" "}*/}
                {/*    {table.getFilteredRowModel().rows.length} row(s) selected.*/}


                {/*</div>*/}
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}