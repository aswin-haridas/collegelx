'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import ItemCard from '@/components/ItemCard';
import SearchFilter from '@/components/SearchFilter';

export default function Buy() {
  const [items, setItems] = useState<any[]>([]); // Replace 'any' with Item[] after fetching

  // Example fetch (to be implemented)
  async function fetchItems() {
    const { data } = await supabase.from('items').select('*').eq('approved', true);
    setItems(data || []);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Browse Items</h2>
      <SearchFilter />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}