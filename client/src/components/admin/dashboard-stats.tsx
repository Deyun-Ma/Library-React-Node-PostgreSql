import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Book, Borrowing, User } from "@shared/schema";
import { ArrowDown, ArrowUp, Book as BookIcon, BookOpen, Users, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardStats() {
  const { data: books, isLoading: booksLoading } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });

  const { data: borrowings, isLoading: borrowingsLoading } = useQuery<Borrowing[]>({
    queryKey: ["/api/borrowings"],
  });

  // Calculate stats
  const totalBooks = books?.length || 0;
  const activeMembers = borrowings ? new Set(borrowings.map(b => b.userId)).size : 0;
  const borrowedBooks = borrowings?.filter(b => b.status === 'borrowed').length || 0;
  const overdueBooks = borrowings?.filter(b => b.status === 'overdue').length || 0;

  // Mock percentage changes for design purposes
  const bookPercentage = 12.5;
  const membersPercentage = 8.2;
  const borrowedPercentage = -3.1;
  const overduePercentage = -5.8;

  if (booksLoading || borrowingsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="ml-4 flex-1">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="p-4">
        <div className="flex items-start">
          <div className="p-3 rounded-full bg-blue-100 text-blue-500">
            <BookIcon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-neutral-500 text-sm">Total Books</p>
            <h3 className="text-2xl font-medium text-neutral-900">{totalBooks.toLocaleString()}</h3>
          </div>
        </div>
        <div className="mt-2 flex items-center text-xs text-green-500">
          <ArrowUp className="h-3 w-3 mr-1" />
          <span>{bookPercentage}% from last month</span>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-start">
          <div className="p-3 rounded-full bg-green-100 text-green-500">
            <Users className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-neutral-500 text-sm">Active Members</p>
            <h3 className="text-2xl font-medium text-neutral-900">{activeMembers.toLocaleString()}</h3>
          </div>
        </div>
        <div className="mt-2 flex items-center text-xs text-green-500">
          <ArrowUp className="h-3 w-3 mr-1" />
          <span>{membersPercentage}% from last month</span>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-start">
          <div className="p-3 rounded-full bg-purple-100 text-purple-500">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-neutral-500 text-sm">Books Borrowed</p>
            <h3 className="text-2xl font-medium text-neutral-900">{borrowedBooks.toLocaleString()}</h3>
          </div>
        </div>
        <div className="mt-2 flex items-center text-xs text-red-500">
          <ArrowDown className="h-3 w-3 mr-1" />
          <span>{Math.abs(borrowedPercentage)}% from last month</span>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-start">
          <div className="p-3 rounded-full bg-orange-100 text-orange-500">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-neutral-500 text-sm">Overdue Books</p>
            <h3 className="text-2xl font-medium text-neutral-900">{overdueBooks.toLocaleString()}</h3>
          </div>
        </div>
        <div className="mt-2 flex items-center text-xs text-green-500">
          <ArrowDown className="h-3 w-3 mr-1" />
          <span>{Math.abs(overduePercentage)}% from last month</span>
        </div>
      </Card>
    </div>
  );
}
