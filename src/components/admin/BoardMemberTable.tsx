import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { BoardMember, useDeleteBoardMember } from "@/hooks/useEditorialBoard";
import { BoardMemberFormDialog } from "./BoardMemberFormDialog";

interface BoardMemberTableProps {
  members: BoardMember[];
  emptyMessage: string;
}

export function BoardMemberTable({ members, emptyMessage }: BoardMemberTableProps) {
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<BoardMember | null>(null);
  const deleteMutation = useDeleteBoardMember();

  const handleDelete = async () => {
    if (deletingMember) {
      await deleteMutation.mutateAsync(deletingMember.id);
      setDeletingMember(null);
    }
  };

  if (members.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-4">{emptyMessage}</p>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Affiliation</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.photo_url || undefined} alt={member.name} />
                    <AvatarFallback>
                      {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    {member.title && (
                      <p className="text-sm text-muted-foreground">{member.title}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{member.affiliation || "-"}</TableCell>
              <TableCell>{member.specialty || "-"}</TableCell>
              <TableCell>
                <Badge variant={member.is_active ? "default" : "secondary"}>
                  {member.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{member.display_order}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingMember(member)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingMember(member)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <BoardMemberFormDialog
        open={!!editingMember}
        onOpenChange={(open) => !open && setEditingMember(null)}
        member={editingMember || undefined}
      />

      <AlertDialog open={!!deletingMember} onOpenChange={(open) => !open && setDeletingMember(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Board Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingMember?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
