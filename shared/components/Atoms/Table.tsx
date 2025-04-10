import React from "react";
import { styles } from "@/shared/lib/styles";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  onRowClick?: (item: T) => void;
}

export function Table<T>({
  data,
  columns,
  keyField,
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: styles.warmBorder }}>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`p-2 text-left ${column.className || ""}`}
                style={{ color: styles.warmText }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={String(item[keyField])}
              className="border-t hover:bg-gray-50"
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              style={{
                cursor: onRowClick ? "pointer" : undefined,
                borderColor: styles.warmBorder,
              }}
            >
              {columns.map((column, index) => (
                <td
                  key={index}
                  className={`p-2 ${column.className || ""}`}
                  style={{ color: styles.warmText }}
                >
                  {typeof column.accessor === "function"
                    ? column.accessor(item)
                    : item[column.accessor] !== undefined
                    ? String(item[column.accessor])
                    : "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
