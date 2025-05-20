import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, ChevronDown, Menu, Search, LogOut, User, BookOpen, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface HeaderProps {
  onToggleSidebar?: () => void;
  onSearch?: (query: string) => void;
}

export default function Header({ onToggleSidebar, onSearch }: HeaderProps) {
  const { user, logoutMutation, isLoading, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const getUserInitials = () => {
    if (!user) return "U";
    
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return "U";
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const isAdminPage = useLocation()[0].startsWith('/admin');

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleSidebar} 
            className="md:hidden text-neutral-700"
            aria-label="Toggle menu"
          >
            <Menu />
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className={`text-xl font-medium ${isAdminPage ? 'text-white' : 'text-primary'}`}>
              {isAdminPage ? 'LibraryHub Admin' : 'LibraryHub'}
            </h1>
          </Link>
        </div>

        <div className="hidden md:block flex-grow max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              type="search"
              placeholder="Search books, authors..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 text-neutral-700 rounded-full border border-neutral-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {isLoading ? (
          <div className="flex items-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : user ? (
          <div className="flex items-center space-x-4">
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-neutral-900">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center focus:outline-none">
                  <Avatar className="h-8 w-8 bg-primary-light text-white">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Your Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/borrowed" className="cursor-pointer flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Borrowed Books
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer font-medium text-primary">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-500 hover:text-red-600 flex items-center"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="space-x-4">
            <Button
              variant="ghost"
              className="px-4 py-2 text-primary hover:bg-neutral-50 rounded-md font-medium"
              onClick={() => setLocation("/auth")}
            >
              Log in
            </Button>
            <Button
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark font-medium"
              onClick={() => setLocation("/auth?tab=signup")}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <Input
            type="search"
            placeholder="Search books, authors..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 text-neutral-700 rounded-full border border-neutral-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
}
