import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "@/lib/protected-route";
import ProfilePage from "@/pages/user/profile-page";
import BorrowedBooksPage from "@/pages/user/borrowed-books-page";
import SupportPage from "@/pages/user/support-page";
import SettingsPage from "@/pages/user/settings-page";
import DashboardPage from "@/pages/admin/dashboard-page";
import BooksPage from "@/pages/admin/books-page";
import UsersPage from "@/pages/admin/users-page";
import TransactionsPage from "@/pages/admin/transactions-page";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/borrowed" component={BorrowedBooksPage} />
      <ProtectedRoute path="/support" component={SupportPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/admin" component={DashboardPage} adminOnly />
      <ProtectedRoute path="/admin/books" component={BooksPage} adminOnly />
      <ProtectedRoute path="/admin/users" component={UsersPage} adminOnly />
      <ProtectedRoute path="/admin/transactions" component={TransactionsPage} adminOnly />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
