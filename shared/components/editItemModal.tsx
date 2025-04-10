import React from "react";
import { Loader2 } from "lucide-react";
import { Item } from "@/shared/lib/types";
import ItemForm from "@/shared/components/ItemForm";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Partial<Item>) => void;
  isLoading: boolean;
  item?: Item;
}

const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  item,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Item</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ItemForm
            item={item}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            submitLabel="Update"
          />
        )}
      </div>
    </div>
  );
};

export default EditItemModal;
