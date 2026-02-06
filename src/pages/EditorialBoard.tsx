import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, ExternalLink } from "lucide-react";
import { useEditorialBoard, BoardMember } from "@/hooks/useEditorialBoard";

interface EditorCardProps {
  name: string;
  role?: string;
  affiliation: string | null;
  title?: string | null;
  specialty: string | null;
  email?: string | null;
  orcid?: string | null;
  image: string | null;
  featured?: boolean;
}

function EditorCard({ 
  name, 
  role, 
  affiliation, 
  title, 
  specialty, 
  email, 
  orcid, 
  image, 
  featured = false 
}: EditorCardProps) {
  const defaultImage = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face";
  
  return (
    <Card className={featured ? "border-primary/20 bg-primary/5" : ""}>
      <CardContent className={featured ? "p-6" : "p-4"}>
        <div className={featured ? "flex flex-col md:flex-row gap-6" : "flex flex-col items-center text-center"}>
          <img
            src={image || defaultImage}
            alt={name}
            className={`rounded-full object-cover ${featured ? "w-32 h-32" : "w-24 h-24"}`}
          />
          <div className={featured ? "flex-1" : "mt-4"}>
            <h3 className={`font-serif font-semibold text-foreground ${featured ? "text-xl" : "text-lg"}`}>
              {name}
            </h3>
            {role && (
              <Badge variant="secondary" className="mt-1">
                {role}
              </Badge>
            )}
            {specialty && (
              <p className="text-primary font-medium mt-2">{specialty}</p>
            )}
            {title && (
              <p className="text-sm text-muted-foreground">{title}</p>
            )}
            {affiliation && (
              <p className="text-sm text-muted-foreground">{affiliation}</p>
            )}
            {(email || orcid) && (
              <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    {email}
                  </a>
                )}
                {orcid && (
                  <a
                    href={`https://orcid.org/${orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    ORCID
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-6">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-6">
              <Skeleton className="w-32 h-32 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const roleDisplayNames: Record<string, string> = {
  editor_in_chief: "Editor-in-Chief",
  associate_editor: "Associate Editor",
  board_member: "Board Member",
  international_advisor: "International Advisor",
};

export default function EditorialBoard() {
  const { data: members, isLoading } = useEditorialBoard();

  const editorInChief = members?.filter(m => m.role === "editor_in_chief") || [];
  const associateEditors = members?.filter(m => m.role === "associate_editor") || [];
  const boardMembers = members?.filter(m => m.role === "board_member") || [];
  const advisors = members?.filter(m => m.role === "international_advisor") || [];

  const hasContent = members && members.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
            Editorial Board
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet our distinguished team of editors and advisors who uphold the highest standards 
            of scholarly publishing in plastic, reconstructive, and burn surgery.
          </p>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : !hasContent ? (
          <Card className="bg-muted/50 border-0">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                Editorial board information coming soon.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Editor-in-Chief */}
            {editorInChief.length > 0 && (
              <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                  Editor-in-Chief
                </h2>
                {editorInChief.map((editor) => (
                  <EditorCard
                    key={editor.id}
                    name={editor.name}
                    role={roleDisplayNames[editor.role]}
                    affiliation={editor.affiliation}
                    title={editor.title}
                    specialty={editor.specialty}
                    email={editor.email}
                    orcid={editor.orcid_id}
                    image={editor.photo_url}
                    featured
                  />
                ))}
              </section>
            )}

            {associateEditors.length > 0 && (
              <>
                <Separator className="my-10" />
                <section className="mb-12">
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                    Associate Editors
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {associateEditors.map((editor) => (
                      <EditorCard
                        key={editor.id}
                        name={editor.name}
                        role={roleDisplayNames[editor.role]}
                        affiliation={editor.affiliation}
                        title={editor.title}
                        specialty={editor.specialty}
                        email={editor.email}
                        orcid={editor.orcid_id}
                        image={editor.photo_url}
                        featured
                      />
                    ))}
                  </div>
                </section>
              </>
            )}

            {boardMembers.length > 0 && (
              <>
                <Separator className="my-10" />
                <section className="mb-12">
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                    Editorial Board Members
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {boardMembers.map((member) => (
                      <EditorCard
                        key={member.id}
                        name={member.name}
                        affiliation={member.affiliation}
                        specialty={member.specialty}
                        image={member.photo_url}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}

            {advisors.length > 0 && (
              <>
                <Separator className="my-10" />
                <section className="mb-12">
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                    International Advisory Board
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Our international advisors provide global perspective and expertise to guide the journal's 
                    editorial direction and ensure alignment with international standards.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {advisors.map((advisor) => (
                      <EditorCard
                        key={advisor.id}
                        name={advisor.name}
                        affiliation={advisor.affiliation}
                        specialty={advisor.specialty}
                        image={advisor.photo_url}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {/* Join the Board CTA */}
        <Card className="bg-muted/50 border-0 mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
              Interested in Joining Our Team?
            </h3>
            <p className="text-muted-foreground mb-4 max-w-xl mx-auto">
              We welcome applications from qualified researchers and clinicians who wish to 
              contribute to the peer review process.
            </p>
            <a
              href="/become-reviewer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Become a Reviewer
            </a>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
