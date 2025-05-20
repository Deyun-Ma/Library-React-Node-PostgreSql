import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";

interface SidebarProps {
  onFilterChange: (filters: {
    categories: number[];
    available: boolean;
    formats: string[];
  }) => void;
}

export default function Sidebar({ onFilterChange }: SidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [availability, setAvailability] = useState<string>("all");
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleCategoryChange = (checked: boolean | "indeterminate", id: number) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, id]);
    } else {
      setSelectedCategories((prev) => prev.filter((category) => category !== id));
    }
  };

  const handleFormatChange = (checked: boolean | "indeterminate", format: string) => {
    if (checked) {
      setSelectedFormats((prev) => [...prev, format]);
    } else {
      setSelectedFormats((prev) => prev.filter((f) => f !== format));
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setAvailability("all");
    setSelectedFormats([]);
    onFilterChange({ categories: [], available: false, formats: [] });
  };

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      available: availability === "available",
      formats: selectedFormats,
    });
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="font-medium text-lg mb-4 text-neutral-800">Filters</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-neutral-700 mb-2">Categories</h3>
          <div className="space-y-2">
            {categories.slice(0, 5).map((category) => (
              <div key={category.id} className="flex items-center">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(checked, category.id)}
                  className="text-primary"
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="ml-2 text-sm text-neutral-600"
                >
                  {category.name}
                </Label>
              </div>
            ))}
            {categories.length > 5 && (
              <Button variant="link" className="text-primary text-sm hover:text-primary-dark p-0">
                See more
              </Button>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-neutral-700 mb-2">Availability</h3>
          <RadioGroup value={availability} onValueChange={setAvailability}>
            <div className="space-y-2">
              <div className="flex items-center">
                <RadioGroupItem value="all" id="all" className="text-primary" />
                <Label htmlFor="all" className="ml-2 text-sm text-neutral-600">
                  All
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="available" id="available" className="text-primary" />
                <Label htmlFor="available" className="ml-2 text-sm text-neutral-600">
                  Available now
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-sm font-medium text-neutral-700 mb-2">Format</h3>
          <div className="space-y-2">
            {["Hardcover", "Paperback", "E-Book", "Audiobook"].map((format) => (
              <div key={format} className="flex items-center">
                <Checkbox
                  id={`format-${format}`}
                  checked={selectedFormats.includes(format)}
                  onCheckedChange={(checked) => handleFormatChange(checked, format)}
                  className="text-primary"
                />
                <Label
                  htmlFor={`format-${format}`}
                  className="ml-2 text-sm text-neutral-600"
                >
                  {format}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
          <Button
            variant="default"
            className="w-full mt-2 bg-primary text-white"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </aside>
  );
}
