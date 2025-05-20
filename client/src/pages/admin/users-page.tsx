import AdminSidebar from "@/components/admin/admin-sidebar";
import Header from "@/components/layout/header";
import UserTable from "@/components/admin/user-table";

export default function UsersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <div className="flex flex-1">
        <AdminSidebar />
        
        <main className="flex-grow overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-medium text-neutral-900 mb-6">User Management</h1>
            
            <UserTable />
          </div>
        </main>
      </div>
    </div>
  );
}
