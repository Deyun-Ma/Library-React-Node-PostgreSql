import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Book, Borrowing } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { format, isPast, isToday } from "date-fns";

interface BorrowingTableProps {
  userId?: number;
}

export default function BorrowingTable({ userId }: BorrowingTableProps) {
  const { toast } = useToast();
  
  // Get the user's borrowings or all borrowings if no userId provided
  const { data: borrowings = [], isLoading: borrowingsLoading } = useQuery<Borrowing[]>({
    queryKey: [userId ? `/api/borrowings/user` : "/api/borrowings"],
  });
  
  // Get all books to display titles
  const { data: books = [], isLoading: booksLoading } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });
  
  const { mutate: returnBook, isPending } = useMutation({
    mutationFn: async (borrowingId: number) => {
      const response = await apiRequest("POST", `/api/borrowings/${borrowingId}/return`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Book returned",
        description: "Thank you for returning the book!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/borrowings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/borrowings/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to return book",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleReturnBook = (borrowingId: number) => {
    returnBook(borrowingId);
  };
  
  const getBookTitle = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    return book ? book.title : `Book #${bookId}`;
  };
  
  const getStatusBadge = (borrowing: Borrowing) => {
    switch (borrowing.status) {
      case "returned":
        return <Badge className="bg-green-100 text-green-800">Returned</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "borrowed":
        const dueDate = new Date(borrowing.dueDate);
        const isDueSoon = isToday(dueDate) || (isPast(dueDate) && dueDate >= new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)); // 3 days
        return isDueSoon ? (
          <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>
        ) : (
          <Badge className="bg-blue-100 text-blue-800">Borrowed</Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  if (borrowingsLoading || booksLoading) {
    return <div>Loading borrowings...</div>;
  }
  
  if (borrowings.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">No borrowed books</h3>
        <p className="text-neutral-500">
          {userId ? "You haven't borrowed any books yet." : "No borrowing records found."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book</TableHead>
            <TableHead>Borrow Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Return Date</TableHead>
            <TableHead>Status</TableHead>
            {userId && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {borrowings.map((borrowing) => (
            <TableRow key={borrowing.id}>
              <TableCell className="font-medium">{getBookTitle(borrowing.bookId)}</TableCell>
              <TableCell>{format(new Date(borrowing.borrowDate), "MMM d, yyyy")}</TableCell>
              <TableCell>{format(new Date(borrowing.dueDate), "MMM d, yyyy")}</TableCell>
              <TableCell>
                {borrowing.returnDate
                  ? format(new Date(borrowing.returnDate), "MMM d, yyyy")
                  : "-"}
              </TableCell>
              <TableCell>{getStatusBadge(borrowing)}</TableCell>
              {userId && (
                <TableCell>
                  {borrowing.status === "borrowed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => handleReturnBook(borrowing.id)}
                      disabled={isPending}
                    >
                      <RotateCcw className="h-3 w-3" />
                      Return
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
