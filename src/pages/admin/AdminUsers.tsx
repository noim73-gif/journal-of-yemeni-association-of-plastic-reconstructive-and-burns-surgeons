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
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";

const roleColors: Record<string, string> = {
  admin: "bg-destructive/12 text-destructive",
  moderator: "bg-[hsl(var(--status-info)/0.12)] text-[hsl(var(--status-info))]",
  reviewer: "bg-accent/15 text-accent",
  user: "bg-[hsl(var(--status-success)/0.12)] text-[hsl(var(--status-success))]",
};

const roleIcons: Record<string, React.ReactNode> = {
  admin: <Shield className="h-3 w-3" />,
  moderator: <UserCog className="h-3 w-3" />,
  reviewer: <Eye className="h-3 w-3" />,
  user: <Users className="h-3 w-3" />,
};

export default function AdminUsers() {
  const { users, loading, assignRole, removeRole, updateAccountStatus } = useUsers();
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
      <DashboardHeader
        eyebrow="People"
        title="User Management"
        description="Manage users, assign roles, and configure reviewer accounts"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-stat">{totalUsers}</p>
            <p className="text-overline mt-1">Total Users</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-destructive/12">
            <ShieldCheck className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <p className="text-stat">{adminCount}</p>
            <p className="text-overline mt-1">Administrators</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-accent/15">
            <UserCheck className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-stat">{reviewerCount}</p>
            <p className="text-overline mt-1">Reviewers</p>
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
                <TableHead>Status</TableHead>
                <TableHead>Profession / Specialty</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-body-sm">
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
                          <p className="text-caption truncate max-w-[200px]">
                            {user.user_id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.account_status === "verified" ? (
                        <Badge variant="secondary" className="bg-[hsl(var(--status-success)/0.12)] text-[hsl(var(--status-success))] gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </Badge>
                      ) : user.account_status === "suspended" ? (
                        <Badge variant="secondary" className="bg-destructive/12 text-destructive gap-1">
                          <XCircle className="h-3 w-3" />
                          Suspended
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-[hsl(var(--status-warning)/0.14)] text-[hsl(var(--status-warning))] gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Unverified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{user.profession || "—"}</p>
                        <p className="text-muted-foreground text-xs">{user.primary_specialty || "—"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length === 0 ? (
                          <span className="text-meta">No roles</span>
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
                                className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-meta">
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
                          <DropdownMenuSeparator />
                          {user.account_status !== "verified" && (
                            <DropdownMenuItem onClick={() => updateAccountStatus(user.user_id, "verified")}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Verify User
                            </DropdownMenuItem>
                          )}
                          {user.account_status !== "suspended" && (
                            <DropdownMenuItem onClick={() => updateAccountStatus(user.user_id, "suspended")} className="text-destructive">
                              <XCircle className="h-4 w-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          )}
                          {user.account_status === "suspended" && (
                            <DropdownMenuItem onClick={() => updateAccountStatus(user.user_id, "unverified")}>
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Unsuspend User
                            </DropdownMenuItem>
                          )}
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
