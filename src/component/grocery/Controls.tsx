interface ControlsProps {
  setSearch: (v: string) => void;
  setCategory: (v: string) => void;
  setSort: (v: "asc" | "desc") => void;
}

export default function Controls({
  setSearch,
  setCategory,
  setSort,
}: ControlsProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      <input
        className="border px-3 py-2 rounded"
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="border px-3 py-2 rounded"
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>All</option>
        <option>Fruit</option>
        <option>Dairy</option>
        <option>Bakery</option>
      </select>

      <select
        className="border px-3 py-2 rounded"
        onChange={(e) => setSort(e.target.value as "asc" | "desc")}
      >
        <option value="asc">Price ↑</option>
        <option value="desc">Price ↓</option>
      </select>
    </div>
  );
}
