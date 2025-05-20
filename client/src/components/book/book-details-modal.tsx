import { Book } from "@shared/schema";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle, 
  DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bookmark, Heart, Star, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { addDays, format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface BookDetailsModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

// Mock reviews for UI demonstration
const mockReviews: Review[] = [
  {
    id: 1,
    name: "John Davis",
    rating: 4,
    date: "May 15, 2023",
    comment: "Absolutely captivating from the first page! The worldbuilding is exceptional, creating libraries you can practically smell and feel. The protagonist's journey feels authentic, and the supporting characters add wonderful depth."
  },
  {
    id: 2,
    name: "Anna Thompson",
    rating: 3,
    date: "April 3, 2023",
    comment: "I enjoyed the creative premise, but found the middle section dragged a bit. The magical system based on literary genres was innovative, though some characters felt one-dimensional. Still worth reading if you love books about books!"
  }
];

export default function BookDetailsModal({ book, isOpen, onClose }: BookDetailsModalProps) {
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
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to borrow book",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBorrow = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to borrow books",
        variant: "destructive"
      });
      return;
    }
    borrowBook();
  };

  // Calculate average rating
  const averageRating = book.ratingCount ? book.rating / book.ratingCount : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex justify-between">
            <DialogTitle className="sr-only">Book Details</DialogTitle>
            <DialogClose className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-700">
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full aspect-[3/4] flex items-center justify-center bg-primary/10 text-primary font-medium rounded-lg shadow-md">
                  No Cover Available
                </div>
              )}

              <div className="mt-4">
                <Button
                  disabled={book.availableCopies <= 0 || isPending || !user}
                  className="w-full bg-primary text-white py-3 mb-3 flex items-center justify-center"
                  onClick={handleBorrow}
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  {book.availableCopies <= 0 ? "Unavailable" : 
                    isPending ? "Processing..." : "Borrow Book"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border border-neutral-300 text-neutral-700 py-3 flex items-center justify-center"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Add to Wishlist
                </Button>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="flex items-center mb-2">
                <Badge className="text-xs px-2 py-1 bg-primary-light bg-opacity-20 text-primary rounded-full">
                  {book.format || "Book"}
                </Badge>
                <div className="ml-auto flex items-center text-neutral-500">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm ml-1">
                    {book.ratingCount ? 
                      `${averageRating.toFixed(1)} (${book.ratingCount} ratings)` : 
                      'No ratings yet'}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-medium text-neutral-900 mb-1">{book.title}</h2>
              <p className="text-neutral-600 mb-4">by {book.author}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-50 p-3 rounded-md">
                  <div className="text-xs text-neutral-500 mb-1">Published</div>
                  <div>{book.publishedDate || 'Not specified'}</div>
                </div>
                <div className="bg-neutral-50 p-3 rounded-md">
                  <div className="text-xs text-neutral-500 mb-1">Format</div>
                  <div>{book.format || 'Not specified'}, {book.totalCopies} copies</div>
                </div>
                <div className="bg-neutral-50 p-3 rounded-md">
                  <div className="text-xs text-neutral-500 mb-1">ISBN</div>
                  <div>{book.isbn}</div>
                </div>
                <div className="bg-neutral-50 p-3 rounded-md">
                  <div className="text-xs text-neutral-500 mb-1">Availability</div>
                  <div className={book.availableCopies > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {book.availableCopies > 0 ? 
                      `${book.availableCopies} ${book.availableCopies === 1 ? 'copy' : 'copies'} available` : 
                      'Currently unavailable'}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-lg text-neutral-800 mb-3">Synopsis</h3>
                <p className="text-neutral-600 leading-relaxed">
                  {book.description || 'No description available for this book.'}
                </p>
              </div>

              <Separator />

              <div className="mt-6">
                <h3 className="font-medium text-lg text-neutral-800 mb-3">Reviews</h3>

                {mockReviews.length > 0 ? (
                  <div className="space-y-4">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="border-b border-neutral-200 pb-4">
                        <div className="flex items-center mb-2">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback className="bg-primary-light text-white">
                              {review.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-neutral-800">{review.name}</div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200'}`} 
                                />
                              ))}
                              <span className="text-xs text-neutral-500 ml-2">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-neutral-600 text-sm">
                          {review.comment}
                        </p>
                      </div>
                    ))}

                    <Button variant="link" className="text-primary hover:text-primary-dark text-sm p-0 flex items-center">
                      See all {book.ratingCount || '0'} reviews
                      <span className="material-icons ml-1 text-sm">arrow_forward</span>
                    </Button>
                  </div>
                ) : (
                  <p className="text-neutral-500 text-sm">No reviews yet. Be the first to review this book!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
