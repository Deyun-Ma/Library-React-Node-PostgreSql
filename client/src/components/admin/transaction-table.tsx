import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Book, Borrowing, User } from "@shared/schema";
import { format } from "date-fns";

export default function TransactionTable() {
  const { data: borrowings = [], isLoading: borrowingsLoading } = useQuery<Borrowing[]>({
    queryKey: ["/api/borrowings"],
  });

  const { data: books = [], isLoading: booksLoading } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });

  // In a production environment, we'd have API endpoints to get users
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      // This would be an API call to get users
      return [];
    },
  });

  const isLoading = borrowingsLoading || booksLoading || usersLoading;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "borrowed":
        return <Badge className="bg-blue-100 text-blue-800">Borrowed</Badge>;
      case "returned":
        return <Badge className="bg-green-100 text-green-800">Returned</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getBookTitle = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    return book ? book.title : `Book #${bookId}`;
  };

  const getUserName = (userId: number) => {
    // Mock user names since we don't have the API endpoint
    const mockUsers: Record<number, string> = {
      1: "Admin User",
      2: "John Doe",
      3: "Jane Smith",
    };
    
    return mockUsers[userId] || `User #${userId}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Records of all book borrowings and returns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Borrow Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : borrowings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                borrowings.map((borrowing) => (
                  <TableRow key={borrowing.id}>
                    <TableCell>{getUserName(borrowing.userId)}</TableCell>
                    <TableCell className="font-medium">{getBookTitle(borrowing.bookId)}</TableCell>
                    <TableCell>{format(new Date(borrowing.borrowDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(borrowing.dueDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {borrowing.returnDate
                        ? format(new Date(borrowing.returnDate), "MMM d, yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(borrowing.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
