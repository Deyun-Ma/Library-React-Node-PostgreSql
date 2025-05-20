import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Borrowing } from "@shared/schema";
import { format } from "date-fns";
import { BookOpen, Plus, User, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityList() {
  const { data: borrowings, isLoading } = useQuery<Borrowing[]>({
    queryKey: ["/api/borrowings"],
  });

  // Get most recent activities (most recent 4 borrowings)
  const recentActivities = borrowings
    ? [...borrowings].sort((a, b) => 
        new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
      ).slice(0, 4)
    : [];

  const getActivityIcon = (activity: Borrowing) => {
    switch (activity.status) {
      case 'borrowed':
        return (
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 flex-shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
        );
      case 'returned':
        return (
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 flex-shrink-0">
            <RotateCcw className="h-5 w-5" />
          </div>
        );
      case 'overdue':
        return (
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0">
            <User className="h-5 w-5" />
          </div>
        );
    }
  };

  const getActivityTitle = (activity: Borrowing) => {
    switch (activity.status) {
      case 'borrowed':
        return 'Book Borrowed';
      case 'returned':
        return 'Book Returned';
      case 'overdue':
        return 'Overdue Book Notice';
      default:
        return 'Book Activity';
    }
  };

  const formatActivityTime = (date: string) => {
    try {
      return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start p-4 border-b border-neutral-200">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="ml-4 flex-grow">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center p-4 border-b border-neutral-200">
        <h3 className="font-medium text-lg text-neutral-800">Recent Activity</h3>
        <Button variant="link" className="text-primary text-sm p-0">
          View All
        </Button>
      </div>
      
      <ul className="divide-y divide-neutral-200">
        {recentActivities.length === 0 ? (
          <li className="p-8 text-center text-neutral-500">
            No recent activity to display.
          </li>
        ) : (
          recentActivities.map((activity) => (
            <li key={activity.id} className="p-4 hover:bg-neutral-50">
              <div className="flex items-start">
                {getActivityIcon(activity)}
                <div className="ml-4 flex-grow">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-neutral-800">
                      {getActivityTitle(activity)}
                    </p>
                    <span className="text-xs text-neutral-500">
                      {formatActivityTime(activity.borrowDate)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    User #{activity.userId} has {activity.status === 'borrowed' ? 'borrowed' : activity.status === 'returned' ? 'returned' : 'overdue'} book #{activity.bookId}
                    {activity.status === 'borrowed' && activity.dueDate && 
                      ` (due on ${format(new Date(activity.dueDate), "MMM d, yyyy")})`}
                  </p>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </Card>
  );
}
