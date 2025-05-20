import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: {
    categories: number[];
    available: boolean;
    formats: string[];
    sort?: string;
  }) => void;
}

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  onFilterChange,
}: MobileFilterDrawerProps) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [availability, setAvailability] = useState<string>("all");
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("relevance");

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
    setSortBy("relevance");
  };

  const handleApplyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      available: availability === "available",
      formats: selectedFormats,
      sort: sortBy,
    });
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <div className="max-w-md w-full mx-auto">
          <DrawerHeader className="flex justify-between items-center">
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-neutral-700 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox
                        id={`mobile-category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => handleCategoryChange(checked, category.id)}
                      />
                      <Label
                        htmlFor={`mobile-category-${category.id}`}
                        className="ml-2 text-sm text-neutral-600"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-700 mb-3">Availability</h3>
                <RadioGroup value={availability} onValueChange={setAvailability}>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <RadioGroupItem value="all" id="mobile-all" />
                      <Label htmlFor="mobile-all" className="ml-2 text-sm text-neutral-600">
                        All
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="available" id="mobile-available" />
                      <Label htmlFor="mobile-available" className="ml-2 text-sm text-neutral-600">
                        Available now
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-700 mb-3">Format</h3>
                <div className="space-y-2">
                  {["Hardcover", "Paperback", "E-Book", "Audiobook"].map((format) => (
                    <div key={format} className="flex items-center">
                      <Checkbox
                        id={`mobile-format-${format}`}
                        checked={selectedFormats.includes(format)}
                        onCheckedChange={(checked) => handleFormatChange(checked, format)}
                      />
                      <Label
                        htmlFor={`mobile-format-${format}`}
                        className="ml-2 text-sm text-neutral-600"
                      >
                        {format}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-700 mb-3">Sort by</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="recentlyAdded">Recently Added</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    <SelectItem value="mostPopular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-neutral-200">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleClearFilters}
              >
                Clear All
              </Button>
              <Button
                className="w-full bg-primary text-white"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
