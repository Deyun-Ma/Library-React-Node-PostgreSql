import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Book } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Sidebar from "@/components/layout/sidebar";
import MobileFilterDrawer from "@/components/layout/mobile-filter-drawer";
import BookCard from "@/components/book/book-card";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { GridIcon, ListIcon, FilterIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState({
    categories: [] as number[],
    available: false,
    formats: [] as string[],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const booksPerPage = 6;

  // Get books
  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ["/api/books", searchQuery, filters, sortBy],
  });

  // Filter books
  const filteredBooks = books.filter(book => {
    // Filter by category
    if (filters.categories.length > 0 && !filters.categories.includes(book.categoryId || 0)) {
      return false;
    }
    
    // Filter by availability
    if (filters.available && book.availableCopies <= 0) {
      return false;
    }
    
    // Filter by format
    if (filters.formats.length > 0 && !filters.formats.includes(book.format || '')) {
      return false;
    }
    
    return true;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "recentlyAdded":
        return b.id - a.id; // Assuming higher IDs are more recent
      case "mostPopular":
        const aRating = a.ratingCount ? a.rating / a.ratingCount : 0;
        const bRating = b.ratingCount ? b.rating / b.ratingCount : 0;
        return bRating - aRating;
      default:
        return 0;
    }
  });

  // Calculate pagination
  const pageCount = Math.ceil(sortedBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const displayedBooks = sortedBooks.slice(startIndex, startIndex + booksPerPage);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: {
    categories: number[];
    available: boolean;
    formats: string[];
    sort?: string;
  }) => {
    setFilters({
      categories: newFilters.categories,
      available: newFilters.available,
      formats: newFilters.formats,
    });
    
    if (newFilters.sort) {
      setSortBy(newFilters.sort);
    }
    
    setCurrentPage(1);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleSidebar={() => setIsSidebarOpen(true)} onSearch={handleSearch} />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar - hidden on mobile */}
            <div className="hidden md:block">
              <Sidebar onFilterChange={handleFilterChange} />
            </div>
            
            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)}
              onFilterChange={handleFilterChange}
            />
            
            {/* Book Catalog */}
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-medium text-neutral-900">Book Catalog</h1>
                
                <div className="flex space-x-2 items-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="md:hidden flex items-center text-sm text-primary font-medium"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <FilterIcon className="mr-1 h-4 w-4" />
                    Filters
                  </Button>
                  
                  <div className="hidden md:flex items-center space-x-2 text-sm text-neutral-500">
                    <span>Sort by:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-8 w-36 text-xs">
                        <SelectValue placeholder="Relevance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="recentlyAdded">Recently Added</SelectItem>
                        <SelectItem value="alphabetical">Alphabetical</SelectItem>
                        <SelectItem value="mostPopular">Most Popular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="hidden md:flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-600">
                      <ListIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-neutral-100 text-primary">
                      <GridIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <Skeleton className="h-64 w-full" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayedBooks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No books found</h3>
                  <p className="text-neutral-500 mb-4">
                    Try changing your search criteria or check back later for new books.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFilters({ categories: [], available: false, formats: [] });
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {!isLoading && pageCount > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(pageCount, 5) }).map((_, i) => {
                        const pageNumber = currentPage <= 3 || pageCount <= 5
                          ? i + 1
                          : currentPage + i - 2 > pageCount
                            ? pageCount - 4 + i
                            : currentPage + i - 2;
                            
                        return pageNumber > 0 && pageNumber <= pageCount ? (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              isActive={currentPage === pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        ) : null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                          disabled={currentPage === pageCount}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
