import AdminSidebar from "@/components/admin/admin-sidebar";
import Header from "@/components/layout/header";
import TransactionTable from "@/components/admin/transaction-table";

export default function TransactionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <div className="flex flex-1">
        <AdminSidebar />
        
        <main className="flex-grow overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-medium text-neutral-900 mb-6">Transaction History</h1>
            
            <TransactionTable />
          </div>
        </main>
      </div>
    </div>
  );
}
