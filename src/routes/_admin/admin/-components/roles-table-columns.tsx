import { Role } from "@/types/role.types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "isSystem",
    header: "Role Type",
    cell: ({ row }) => {
      return row.getValue("isSystem") ? "System" : "Manual";
    },
  },
  {
    id: "permissions",
    cell: () => {
      <h1>View Permissions</h1>;
    },
  },
];
