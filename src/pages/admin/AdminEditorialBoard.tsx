import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { useEditorialBoardAdmin } from "@/hooks/useEditorialBoard";
import { BoardMemberTable } from "@/components/admin/BoardMemberTable";
import { BoardMemberFormDialog } from "@/components/admin/BoardMemberFormDialog";

export default function AdminEditorialBoard() {
  const { data: members, isLoading } = useEditorialBoardAdmin();
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const editorInChief = members?.filter(m => m.role === "editor_in_chief") || [];
  const associateEditors = members?.filter(m => m.role === "associate_editor") || [];
  const boardMembers = members?.filter(m => m.role === "board_member") || [];
  const advisors = members?.filter(m => m.role === "international_advisor") || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h1">
            Editorial Board
          </h1>
          <p className="text-lead mt-2">
            Manage editorial board members and advisors
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Editor-in-Chief</CardTitle>
          </CardHeader>
          <CardContent>
            <BoardMemberTable 
              members={editorInChief} 
              emptyMessage="No Editor-in-Chief assigned" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Associate Editors</CardTitle>
          </CardHeader>
          <CardContent>
            <BoardMemberTable 
              members={associateEditors} 
              emptyMessage="No Associate Editors" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Board Members</CardTitle>
          </CardHeader>
          <CardContent>
            <BoardMemberTable 
              members={boardMembers} 
              emptyMessage="No Board Members" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>International Advisors</CardTitle>
          </CardHeader>
          <CardContent>
            <BoardMemberTable 
              members={advisors} 
              emptyMessage="No International Advisors" 
            />
          </CardContent>
        </Card>
      </div>

      <BoardMemberFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
      />
    </div>
  );
}
