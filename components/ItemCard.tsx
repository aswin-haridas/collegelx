import { Item } from '@/lib/types';

interface Props {
  item: Item;
}

export default function ItemCard({ item }: Props) {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <h3 className="font-semibold">{item.title}</h3>
      <p className="text-gray-600">{item.description}</p>
      <p className="text-blue-500 font-bold">${item.price}</p>
    </div>
  );
}