import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User } from "@shared/schema";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function UserTable() {
  const [searchQuery, setSearchQuery] = useState("");

  // In a production environment, we'd have an API endpoint to get all users
  // For this demo, we're using a mock approach to show the UI
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      // This would normally be an API call to get users
      // Since we don't have that endpoint in our API, we'll return an empty array
      // In a real app, we'd have this endpoint and proper data
      return [];
    },
  });

  // Mock users for UI demonstration
  const mockUsers: User[] = [
    {
      id: 1,
      email: "admin@libraryhub.com",
      password: "hashed_password",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    },
    {
      id: 2,
      email: "john.doe@example.com",
      password: "hashed_password",
      firstName: "John",
      lastName: "Doe",
      role: "user",
    },
    {
      id: 3,
      email: "jane.smith@example.com",
      password: "hashed_password",
      firstName: "Jane",
      lastName: "Smith",
      role: "user",
    },
  ];

  // Filter users based on search query
  const filteredUsers = mockUsers.filter((user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fullName.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>User Management</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-10 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800">Member</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </TableCell>
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
