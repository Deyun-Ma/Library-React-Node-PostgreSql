import { useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import BorrowingTable from "@/components/book/borrowing-table";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Borrowing } from "@shared/schema";

export default function BorrowedBooksPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  // Get user's borrowings
  const { data: borrowings = [], isLoading } = useQuery<Borrowing[]>({
    queryKey: ["/api/borrowings/user"],
    enabled: !!user,
  });

  // Count active borrowings
  const activeBorrowings = borrowings.filter(b => b.status === "borrowed").length;
  const overdueBorrowings = borrowings.filter(b => b.status === "overdue").length;

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-medium text-neutral-900">Your Borrowed Books</h1>
            
            <Link href="/">
              <Button className="bg-primary text-white">
                Browse Books
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-neutral-500 text-sm">Currently Borrowed</p>
                    <h3 className="text-2xl font-medium text-neutral-900">{activeBorrowings}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 text-red-500">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-neutral-500 text-sm">Overdue</p>
                    <h3 className="text-2xl font-medium text-neutral-900">{overdueBorrowings}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-500">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-neutral-500 text-sm">History Total</p>
                    <h3 className="text-2xl font-medium text-neutral-900">{borrowings.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Borrowing History</CardTitle>
              <CardDescription>
                View and manage your borrowed books
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Loading your borrowing history...</p>
                </div>
              ) : (
                <BorrowingTable userId={user.id} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
