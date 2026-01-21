import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, ExternalLink } from "lucide-react";

const editorInChief = {
  name: "Dr. Ahmed Al-Maqtari",
  role: "Editor-in-Chief",
  affiliation: "Yemen University of Science and Technology",
  department: "Department of Plastic Surgery",
  specialty: "Reconstructive Microsurgery",
  email: "editor@yjprbs.org",
  orcid: "0000-0001-2345-6789",
  image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
  bio: "Dr. Al-Maqtari has over 20 years of experience in plastic and reconstructive surgery. He has published extensively on burn reconstruction techniques and microsurgical innovations in resource-limited settings."
};

const associateEditors = [
  {
    name: "Dr. Fatima Hassan",
    role: "Associate Editor",
    affiliation: "Sana'a University Hospital",
    department: "Division of Burn Surgery",
    specialty: "Burn Care & Reconstruction",
    email: "f.hassan@yjprbs.org",
    orcid: "0000-0002-3456-7890",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dr. Mohammed Al-Sanabani",
    role: "Associate Editor",
    affiliation: "Aden General Hospital",
    department: "Department of Surgery",
    specialty: "Hand Surgery & Trauma",
    email: "m.sanabani@yjprbs.org",
    orcid: "0000-0003-4567-8901",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
  },
];

const editorialBoardMembers = [
  {
    name: "Dr. Sarah Al-Hubaishi",
    affiliation: "Taiz University",
    specialty: "Craniofacial Surgery",
    country: "Yemen",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dr. Khaled Omar",
    affiliation: "Hadramout University",
    specialty: "Aesthetic Surgery",
    country: "Yemen",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dr. Nadia Al-Asbahi",
    affiliation: "Al-Thawra Modern General Hospital",
    specialty: "Pediatric Plastic Surgery",
    country: "Yemen",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dr. Omar Basharahil",
    affiliation: "Saudi German Hospital",
    specialty: "Reconstructive Surgery",
    country: "Yemen",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
  },
];

const internationalAdvisors = [
  {
    name: "Prof. James Mitchell",
    affiliation: "Johns Hopkins University",
    specialty: "Burn Surgery & Critical Care",
    country: "USA",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Prof. Elena Rodriguez",
    affiliation: "University of Barcelona",
    specialty: "Microsurgery",
    country: "Spain",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Prof. Ahmed Kamel",
    affiliation: "Cairo University",
    specialty: "Craniofacial Surgery",
    country: "Egypt",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Prof. Yuki Tanaka",
    affiliation: "Tokyo Medical University",
    specialty: "Hand & Peripheral Nerve Surgery",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face",
  },
];

interface EditorCardProps {
  name: string;
  role?: string;
  affiliation: string;
  department?: string;
  specialty: string;
  email?: string;
  orcid?: string;
  image: string;
  bio?: string;
  country?: string;
  featured?: boolean;
}

function EditorCard({ 
  name, 
  role, 
  affiliation, 
  department, 
  specialty, 
  email, 
  orcid, 
  image, 
  bio,
  country,
  featured = false 
}: EditorCardProps) {
  return (
    <Card className={featured ? "border-primary/20 bg-primary/5" : ""}>
      <CardContent className={featured ? "p-6" : "p-4"}>
        <div className={featured ? "flex flex-col md:flex-row gap-6" : "flex flex-col items-center text-center"}>
          <img
            src={image}
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
            <p className="text-primary font-medium mt-2">{specialty}</p>
            {department && (
              <p className="text-sm text-muted-foreground">{department}</p>
            )}
            <p className="text-sm text-muted-foreground">{affiliation}</p>
            {country && (
              <p className="text-sm text-muted-foreground">{country}</p>
            )}
            {bio && (
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                {bio}
              </p>
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

export default function EditorialBoard() {
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

        {/* Editor-in-Chief */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
            Editor-in-Chief
          </h2>
          <EditorCard {...editorInChief} featured />
        </section>

        <Separator className="my-10" />

        {/* Associate Editors */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
            Associate Editors
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {associateEditors.map((editor) => (
              <EditorCard key={editor.name} {...editor} featured />
            ))}
          </div>
        </section>

        <Separator className="my-10" />

        {/* Editorial Board Members */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
            Editorial Board Members
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {editorialBoardMembers.map((member) => (
              <EditorCard key={member.name} {...member} />
            ))}
          </div>
        </section>

        <Separator className="my-10" />

        {/* International Advisory Board */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
            International Advisory Board
          </h2>
          <p className="text-muted-foreground mb-6">
            Our international advisors provide global perspective and expertise to guide the journal's 
            editorial direction and ensure alignment with international standards.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {internationalAdvisors.map((advisor) => (
              <EditorCard key={advisor.name} {...advisor} />
            ))}
          </div>
        </section>

        {/* Join the Board CTA */}
        <Card className="bg-muted/50 border-0">
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
