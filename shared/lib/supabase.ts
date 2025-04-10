import { useState } from 'react';
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useSupabase = (table: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchAll = async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table).select('*');
    setLoading(false);
    setError(error);
    return data;
  };

  const insert = async (payload: any) => {
    setLoading(true);
    const { data, error } = await supabase.from(table).insert(payload);
    setLoading(false);
    setError(error);
    return data;
  };

  const update = async (id: number, payload: any) => {
    setLoading(true);
    const { data, error } = await supabase.from(table).update(payload).eq('id', id);
    setLoading(false);
    setError(error);
    return data;
  };

  const remove = async (id: number) => {
    setLoading(true);
    const { data, error } = await supabase.from(table).delete().eq('id', id);
    setLoading(false);
    setError(error);
    return data;
  };

  return { fetchAll, insert, update, remove, loading, error };
};
