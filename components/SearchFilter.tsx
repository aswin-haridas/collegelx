export default function SearchFilter() {
    return (
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search items..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }