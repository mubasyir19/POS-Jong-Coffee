import { useCategory } from "@/hooks/useCategory";
import { useEffect } from "react";

interface CategoryTabsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryTabs({
  selected,
  onSelect,
}: CategoryTabsProps) {
  const { category, fetchCategory } = useCategory();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCategory();

        if (data && data.length > 0 && !selected) {
          onSelect(data[0].id);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
      }
    };
    load();
  }, [fetchCategory, onSelect, selected]);

  return (
    <div className="border-surface flex space-x-6 overflow-x-scroll border-b lg:overflow-hidden">
      {category.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`relative inline-block pb-2 text-sm font-medium whitespace-nowrap transition-colors ${
            selected === c.id
              ? "text-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {c.name}
          {selected === c.name && (
            <span className="bg-primary absolute right-0 -bottom-[1px] left-0 h-[3px] rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
