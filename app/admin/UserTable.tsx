import React from "react";
import { User } from "@/shared/lib/types";
import Table, { Column } from "@/shared/components/Atoms/Table";
import ActionButton from "@/shared/components/Atoms/ActionButton";
import { styles } from "@/shared/lib/styles";

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEditUser }) => {
  const columns: Column<User>[] = [
    { header: "ID", accessor: "userid" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "University", accessor: "university_id" },
    { header: "Department", accessor: "department" },
    {
      header: "Role",
      accessor: (user) => (
        <span
          className="px-2 py-1 rounded text-xs font-medium"
          style={{
            backgroundColor: user.role === "admin" ? "#E8D7F1" : styles.warmBg,
            color: user.role === "admin" ? "#6B3FA0" : styles.warmPrimary,
          }}
        >
          {user.role || "User"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (user) => (
        <ActionButton onClick={() => onEditUser(user)} label="Edit" />
      ),
    },
  ];

  return <Table data={users} columns={columns} keyField="id" />;
};

export default UserTable;
