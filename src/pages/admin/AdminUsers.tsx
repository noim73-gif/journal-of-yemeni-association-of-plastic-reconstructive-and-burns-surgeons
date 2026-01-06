import { useState } from "react";
import { useUsers, UserWithRole } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import {
  Loader2,
  Search,
  MoreHorizontal,
  Shield,
  UserCog,
  X,
  Users,
  ShieldCheck,
  UserCheck,
  Eye,
} from "lucide-react";

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  moderator: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  reviewer: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  user: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const roleIcons: Record<string, React.ReactNode> = {
  admin: <Shield className="h-3 w-3" />,
  moderator: <UserCog className="h-3 w-3" />,
  reviewer: <Eye className="h-3 w-3" />,
  user: <Users className="h-3 w-3" />,
};

export default function AdminUsers() {
  const { users, loading, assignRole, removeRole } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(searchLower) ||
      user.user_id.toLowerCase().includes(searchLower)
    );
  });

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;
    
    setIsSubmitting(true);
    await assignRole(selectedUser.user_id, selectedRole as "admin" | "moderator" | "reviewer" | "user");
    setIsSubmitting(false);
    setIsAssignDialogOpen(false);
    setSelectedRole("");
  };

  const handleRemoveRole = async (user: UserWithRole, role: string) => {
    await removeRole(user.user_id, role as "admin" | "moderator" | "reviewer" | "user");
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Stats
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.roles.includes("admin")).length;
  const reviewerCount = users.filter((u) => u.roles.includes("reviewer")).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, assign roles, and configure reviewer accounts
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalUsers}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{adminCount}</p>
            <p className="text-sm text-muted-foreground">Administrators</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{reviewerCount}</p>
            <p className="text-sm text-muted-foreground">Reviewers</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(user.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.full_name || "Unnamed User"}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {user.user_id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length === 0 ? (
                          <span className="text-sm text-muted-foreground">No roles</span>
                        ) : (
                          user.roles.map((role) => (
                            <Badge
                              key={role}
                              variant="secondary"
                              className={`${roleColors[role] || ""} flex items-center gap-1`}
                            >
                              {roleIcons[role]}
                              {role}
                              <button
                                onClick={() => handleRemoveRole(user, role)}
                                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(parseISO(user.created_at), "MMM d, yyyy")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setIsAssignDialogOpen(true);
                            }}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Assign Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Assign Role Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a role to {selectedUser?.full_name || "this user"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin - Full access to all features
                  </div>
                </SelectItem>
                <SelectItem value="moderator">
                  <div className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    Moderator - Can manage articles and comments
                  </div>
                </SelectItem>
                <SelectItem value="reviewer">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Reviewer - Can review article submissions
                  </div>
                </SelectItem>
                <SelectItem value="user">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    User - Standard user role
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignRole} disabled={!selectedRole || isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
