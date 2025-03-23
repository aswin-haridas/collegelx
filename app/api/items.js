import { supabase } from "@/lib/supabase";

export const getItems = async () => {
  const { data: items, error } = await supabase
    .from("items")
    .select("*")

  if (error) {
    throw new Error(error.message);
  }
  console.log(items);
  return items;
};

export const createItem = async (item) => {
  const { data, error } = await supabase
    .from("items")
    .insert([item])

  if (error) {
    throw new Error(error.message);
  }
  return data;
}