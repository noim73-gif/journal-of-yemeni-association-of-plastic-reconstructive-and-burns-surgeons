import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import {
  BoardMember,
  BoardMemberRole,
  useCreateBoardMember,
  useUpdateBoardMember,
} from "@/hooks/useEditorialBoard";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum(["editor_in_chief", "associate_editor", "board_member", "international_advisor"]),
  title: z.string().optional(),
  affiliation: z.string().optional(),
  specialty: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  orcid_id: z.string().optional(),
  photo_url: z.string().url().optional().or(z.literal("")),
  display_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const roleLabels: Record<BoardMemberRole, string> = {
  editor_in_chief: "Editor-in-Chief",
  associate_editor: "Associate Editor",
  board_member: "Board Member",
  international_advisor: "International Advisor",
};

interface BoardMemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: BoardMember;
}

export function BoardMemberFormDialog({
  open,
  onOpenChange,
  member,
}: BoardMemberFormDialogProps) {
  const createMutation = useCreateBoardMember();
  const updateMutation = useUpdateBoardMember();
  const isEditing = !!member;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "board_member",
      title: "",
      affiliation: "",
      specialty: "",
      email: "",
      orcid_id: "",
      photo_url: "",
      display_order: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (member) {
      form.reset({
        name: member.name,
        role: member.role,
        title: member.title || "",
        affiliation: member.affiliation || "",
        specialty: member.specialty || "",
        email: member.email || "",
        orcid_id: member.orcid_id || "",
        photo_url: member.photo_url || "",
        display_order: member.display_order,
        is_active: member.is_active,
      });
    } else {
      form.reset({
        name: "",
        role: "board_member",
        title: "",
        affiliation: "",
        specialty: "",
        email: "",
        orcid_id: "",
        photo_url: "",
        display_order: 0,
        is_active: true,
      });
    }
  }, [member, form]);

  const onSubmit = async (values: FormValues) => {
    const data = {
      name: values.name,
      role: values.role,
      title: values.title || null,
      affiliation: values.affiliation || null,
      specialty: values.specialty || null,
      email: values.email || null,
      orcid_id: values.orcid_id || null,
      photo_url: values.photo_url || null,
      display_order: values.display_order,
      is_active: values.is_active,
    };

    if (isEditing) {
      await updateMutation.mutateAsync({ id: member.id, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onOpenChange(false);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Board Member" : "Add Board Member"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Professor, MD, PhD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="affiliation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Affiliation</FormLabel>
                  <FormControl>
                    <Input placeholder="University Hospital" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <FormControl>
                    <Input placeholder="Plastic Surgery" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="editor@example.org" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orcid_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ORCID ID</FormLabel>
                  <FormControl>
                    <Input placeholder="0000-0001-2345-6789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/photo.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="display_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Show this member on the public page
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? "Save Changes" : "Add Member"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
