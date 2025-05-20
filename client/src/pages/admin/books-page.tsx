import { useState } from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import Header from "@/components/layout/header";
import BookTable from "@/components/admin/book-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import BookForm from "@/components/book/book-form";
import { Plus } from "lucide-react";

export default function BooksPage() {
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <div className="flex flex-1">
        <AdminSidebar />
        
        <main className="flex-grow overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-medium text-neutral-900">Books Management</h1>
              
              <Button 
                onClick={() => setIsAddBookOpen(true)}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add New Book
              </Button>
            </div>
            
            <BookTable />
          </div>
        </main>
      </div>
      
      {/* Add Book Dialog */}
      <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new book to the library.
          </DialogDescription>
          <BookForm onSuccess={() => setIsAddBookOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
