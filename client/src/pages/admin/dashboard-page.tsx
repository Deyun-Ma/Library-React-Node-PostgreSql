import { Link } from "wouter";
import AdminSidebar from "@/components/admin/admin-sidebar";
import Header from "@/components/layout/header";
import DashboardStats from "@/components/admin/dashboard-stats";
import ActivityList from "@/components/admin/activity-list";
import BookTable from "@/components/admin/book-table";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <div className="flex flex-1">
        <AdminSidebar />
        
        <main className="flex-grow overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-medium text-neutral-900 mb-6">Dashboard</h1>
            
            {/* Dashboard Stats */}
            <DashboardStats />
            
            {/* Book Management Section */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-neutral-800">Book Management</h2>
              <Link href="/admin/books">
                <Button variant="link" className="text-primary hover:text-primary-dark text-sm p-0 flex items-center">
                  View All Books
                  <span className="material-icons ml-1 text-sm">arrow_forward</span>
                </Button>
              </Link>
            </div>
            
            {/* Book Table (Limited) */}
            <div className="mb-8">
              <BookTable />
            </div>
            
            {/* Recent Activity */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-neutral-800">Recent Activity</h2>
              <Link href="/admin/transactions">
                <Button variant="link" className="text-primary hover:text-primary-dark text-sm p-0 flex items-center">
                  View All
                  <span className="material-icons ml-1 text-sm">arrow_forward</span>
                </Button>
              </Link>
            </div>
            
            <ActivityList />
          </div>
        </main>
      </div>
    </div>
  );
}
