import { useSearchParams } from "react-router";

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
}

export function CategoryFilter({
  categories,
  selectedCategories,
}: CategoryFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const toggleCategory = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    const current = newParams.get("category")?.split(",").filter(Boolean) || [];

    if (category === "all") {
      newParams.delete("category");
    } else if (current.includes(category)) {
      const updated = current.filter((c) => c !== category);
      if (updated.length > 0) {
        newParams.set("category", updated.join(","));
      } else {
        newParams.delete("category");
      }
    } else {
      newParams.set("category", [...current, category].join(","));
    }

    setSearchParams(newParams);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => toggleCategory("all")}
          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            selectedCategories.length === 0
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors capitalize ${
              selectedCategories.includes(category)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sort dropdown (optional) */}
      <select className="px-3 py-3 border rounded-lg text-sm">
        <option value="featured">Featured</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="newest">Newest Arrivals</option>
      </select>
    </div>
  );
}
