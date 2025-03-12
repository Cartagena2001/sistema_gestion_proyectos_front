import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
const invoices = [
    {
        invoice: "user1",
        paymentStatus: "user1@example.com",
        totalAmount: "Admin",
        paymentMethod: "Edit",
    },
    {
        invoice: "user2",
        paymentStatus: "user2@example.com",
        totalAmount: "User",
        paymentMethod: "Edit",
    },
    {
        invoice: "user3",
        paymentStatus: "user3@example.com",
        totalAmount: "User",
        paymentMethod: "Edit",
    },
    {
        invoice: "user4",
        paymentStatus: "user4@example.com",
        totalAmount: "Admin",
        paymentMethod: "Edit",
    },
    {
        invoice: "user5",
        paymentStatus: "user5@example.com",
        totalAmount: "User",
        paymentMethod: "Edit",
    },
    {
        invoice: "user6",
        paymentStatus: "user6@example.com",
        totalAmount: "User",
        paymentMethod: "Edit",
    },
    {
        invoice: "user7",
        paymentStatus: "user7@example.com",
        totalAmount: "Admin",
        paymentMethod: "Edit",
    },
]
  
  export function TemplateTable() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Nombre de usuario</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="text-right">Accion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.totalAmount}</TableCell>
              <TableCell className="text-right">{invoice.paymentMethod}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  