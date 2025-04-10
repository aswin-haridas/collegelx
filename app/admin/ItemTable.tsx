import React from "react";
import { Item } from "@/shared/lib/types";
import StatusBadge from "@/shared/components/Atoms/StatusBadge";
import Table, { Column } from "@/shared/components/Atoms/Table";
import ActionButton from "@/shared/components/Atoms/ActionButton";
import { styles } from "@/shared/lib/styles";

interface ItemTableProps {
  items: Item[];
  onEditItem: (item: Item) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({ items, onEditItem }) => {
  const columns: Column<Item>[] = [
    { header: "ID", accessor: "id" },
    { header: "Title", accessor: "title" },
    { header: "Category", accessor: "category" },
    {
      header: "Price",
      accessor: (item) => (
        <span style={{ color: styles.warmPrimary, fontWeight: 500 }}>
          ₹{item.price.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (item) => <StatusBadge status={item.status} />,
    },
    { header: "Department", accessor: "department" },
    {
      header: "Actions",
      accessor: (item) => (
        <ActionButton onClick={() => onEditItem(item)} label="Edit" />
      ),
    },
  ];

  return <Table data={items} columns={columns} keyField="id" />;
};

export default ItemTable;
