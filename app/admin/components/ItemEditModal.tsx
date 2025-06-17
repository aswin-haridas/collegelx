import type { Listing } from "@/types";

interface ItemEditModalProps {
	editingItem: Listing;
	setEditingItem: (item: Listing | null) => void;
	updateItem: (item: Listing) => void;
}

export default function ItemEditModal({
	editingItem,
	setEditingItem,
	updateItem,
}: ItemEditModalProps) {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl border border-gray-300">
				<h2 className="text-xl font-bold mb-4">Edit Item</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						updateItem(editingItem);
						setEditingItem(null);
					}}
				>
					<div className="mb-4">
						<input
							type="text"
							placeholder="Item name"
							value={editingItem.name}
							onChange={(e) =>
								setEditingItem({ ...editingItem, name: e.target.value })
							}
							className="w-full p-2 border border-gray-300 rounded focus:border-black focus:outline-none"
						/>
					</div>
					<div className="mb-4">
						<input
							type="text"
							placeholder="Category"
							value={editingItem.category}
							onChange={(e) =>
								setEditingItem({
									...editingItem,
									category: e.target.value,
								})
							}
							className="w-full p-2 border border-gray-300 rounded focus:border-black focus:outline-none"
						/>
					</div>
					<div className="mb-4">
						<input
							type="number"
							placeholder="Price"
							value={editingItem.price}
							onChange={(e) =>
								setEditingItem({
									...editingItem,
									price: parseFloat(e.target.value) || 0,
								})
							}
							className="w-full p-2 border border-gray-300 rounded focus:border-black focus:outline-none"
						/>
					</div>
					<div className="mb-4">
						<select
							value={editingItem.status}
							onChange={(e) =>
								setEditingItem({ ...editingItem, status: e.target.value })
							}
							className="w-full p-2 border border-gray-300 rounded focus:border-black focus:outline-none"
						>
							<option value="available">Available</option>
							<option value="unlisted">Unlisted</option>
						</select>
					</div>
					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={() => setEditingItem(null)}
							className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
