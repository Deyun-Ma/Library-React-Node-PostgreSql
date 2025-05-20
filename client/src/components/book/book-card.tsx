import { Book } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";
import BookDetailsModal from "./book-details-modal";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { addDays } from "date-fns";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const { mutate: borrowBook, isPending } = useMutation({
    mutationFn: async () => {
      const dueDate = addDays(new Date(), 14); // 2 weeks from now
      await apiRequest("POST", "/api/borrowings", {
        bookId: book.id,
        dueDate,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      queryClient.invalidateQueries({ queryKey: ["/api/borrowings/user"] });
      toast({
        title: "Book borrowed",
        description: `You have successfully borrowed "${book.title}"`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to borrow book",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBorrow = (e: React.MouseEvent) => {
    e.stopPropagation();
    borrowBook();
  };

  // Generate availability status based on available copies
  const getAvailabilityStatus = () => {
    if (book.availableCopies <= 0) {
      return { label: "Unavailable", color: "bg-red-100 text-red-800" };
    }
    if (book.availableCopies < book.totalCopies) {
      return { 
        label: `${book.availableCopies} Available`, 
        color: "bg-yellow-100 text-yellow-800" 
      };
    }
    return { label: "Available", color: "bg-green-100 text-green-800" };
  };

  const status = getAvailabilityStatus();

  return (
    <>
      <div 
        className="book-card bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transform transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
        onClick={() => setIsDetailsOpen(true)}
      >
        <div className="relative h-64 bg-neutral-100">
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-medium">
              No Cover
            </div>
          )}
          <div className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full ${status.color}`}>
            {status.label}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg text-neutral-900 mb-1 line-clamp-1">{book.title}</h3>
          <p className="text-neutral-500 text-sm mb-2">{book.author}</p>
          <div className="flex items-center text-sm text-neutral-500 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(book.rating / (book.ratingCount || 1)) ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200'}`} 
              />
            ))}
            <span className="ml-1">
              {book.ratingCount ? `${(book.rating / book.ratingCount).toFixed(1)} (${book.ratingCount})` : 'No ratings'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs text-neutral-500">
              <span className="mr-1">📚</span>
              {book.format || 'Book'}
            </div>
            <Button
              disabled={book.availableCopies <= 0 || isPending || !user}
              variant={book.availableCopies <= 0 ? "outline" : "default"}
              className={book.availableCopies <= 0 ? "bg-neutral-200 text-neutral-500 cursor-not-allowed" : "bg-primary text-white"}
              size="sm"
              onClick={handleBorrow}
            >
              {book.availableCopies <= 0 ? "On Hold" : 
                isPending ? "Processing..." : "Borrow"}
            </Button>
          </div>
        </div>
      </div>
      
      {isDetailsOpen && (
        <BookDetailsModal 
          book={book} 
          isOpen={isDetailsOpen} 
          onClose={() => setIsDetailsOpen(false)} 
        />
      )}
    </>
  );
}
