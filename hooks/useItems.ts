import { useState, useEffect, useCallback } from "react";

// Define types for the items
interface Item {
  id: string;
  title: string;
  description?: string;
  // Add other properties as needed
}

interface UseItemsProps {
  initialItems?: Item[];
  fetchUrl?: string;
}

interface UseItemsReturn {
  items: Item[];
  loading: boolean;
  error: Error | null;
  getItem: (id: string) => Item | undefined;
  addItem: (item: Omit<Item, "id">) => Promise<Item>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<Item>;
  deleteItem: (id: string) => Promise<boolean>;
  refreshItems: () => Promise<void>;
}

const useItems = ({
  initialItems = [],
  fetchUrl,
}: UseItemsProps = {}): UseItemsReturn => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch items from API
  const fetchItems = useCallback(async () => {
    if (!fetchUrl) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  }, [fetchUrl]);

  // Get a single item by ID
  const getItem = useCallback(
    (id: string) => {
      return items.find((item) => item.id === id);
    },
    [items]
  );

  // Add a new item
  const addItem = useCallback(
    async (item: Omit<Item, "id">): Promise<Item> => {
      setLoading(true);

      try {
        // If using an API
        if (fetchUrl) {
          const response = await fetch(fetchUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });

          if (!response.ok) {
            throw new Error(`Failed to add item: ${response.statusText}`);
          }

          const newItem = await response.json();
          setItems((prevItems) => [...prevItems, newItem]);
          return newItem;
        }
        // Local state only
        else {
          const newItem = {
            ...item,
            id: Date.now().toString(), // Simple ID generation
          } as Item;

          setItems((prevItems) => [...prevItems, newItem]);
          return newItem;
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to add item"));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchUrl]
  );

  // Update an existing item
  const updateItem = useCallback(
    async (id: string, updates: Partial<Item>): Promise<Item> => {
      setLoading(true);

      try {
        // If using an API
        if (fetchUrl) {
          const response = await fetch(`${fetchUrl}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          });

          if (!response.ok) {
            throw new Error(`Failed to update item: ${response.statusText}`);
          }

          const updatedItem = await response.json();
          setItems((prevItems) =>
            prevItems.map((item) => (item.id === id ? updatedItem : item))
          );
          return updatedItem;
        }
        // Local state only
        else {
          const updatedItem = {
            ...getItem(id),
            ...updates,
          } as Item;

          setItems((prevItems) =>
            prevItems.map((item) => (item.id === id ? updatedItem : item))
          );
          return updatedItem;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to update item")
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchUrl, getItem]
  );

  // Delete an item
  const deleteItem = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);

      try {
        // If using an API
        if (fetchUrl) {
          const response = await fetch(`${fetchUrl}/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error(`Failed to delete item: ${response.statusText}`);
          }
        }

        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to delete item")
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchUrl]
  );

  // Initial data fetch
  useEffect(() => {
    if (fetchUrl) {
      fetchItems();
    }
  }, [fetchUrl, fetchItems]);

  return {
    items,
    loading,
    error,
    getItem,
    addItem,
    updateItem,
    deleteItem,
    refreshItems: fetchItems,
  };
};

export default useItems;
