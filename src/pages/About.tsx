import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Globe, Target, Eye, Heart, Users, BookOpen, Award } from "lucide-react";

const editorialBoard = [
  {
    name: "Dr. Ahmed Al-Maktari",
    role: "Editor-in-Chief",
    affiliation: "University of Sana'a",
    specialty: "Plastic & Reconstructive Surgery",
  },
  {
    name: "Dr. Fatima Hassan",
    role: "Deputy Editor",
    affiliation: "Aden Medical Center",
    specialty: "Burn Surgery",
  },
  {
    name: "Dr. Mohammed Al-Sharafi",
    role: "Associate Editor",
    affiliation: "Taiz University Hospital",
    specialty: "Microsurgery",
  },
  {
    name: "Dr. Layla Qasim",
    role: "Associate Editor",
    affiliation: "Al-Thawra Hospital",
    specialty: "Craniofacial Surgery",
  },
  {
    name: "Dr. Omar Al-Jabri",
    role: "Managing Editor",
    affiliation: "Yemen Medical Association",
    specialty: "Hand Surgery",
  },
  {
    name: "Dr. Nadia Al-Ahdal",
    role: "Statistical Editor",
    affiliation: "Sana'a University",
    specialty: "Medical Statistics",
  },
];

const advisoryBoard = [
  {
    name: "Prof. Khalid Rahman",
    affiliation: "King Saud University, Saudi Arabia",
  },
  {
    name: "Prof. Sarah Mitchell",
    affiliation: "Johns Hopkins University, USA",
  },
  {
    name: "Prof. Ahmed El-Sayed",
    affiliation: "Cairo University, Egypt",
  },
  {
    name: "Prof. Maria Santos",
    affiliation: "University of São Paulo, Brazil",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">About YJPRBS</Badge>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                About the Journal
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The Yemeni Journal of Plastic, Reconstructive & Burn Surgery (YJPRBS) is the official 
                peer-reviewed publication of the Yemeni Association of Plastic, Reconstructive and Burn Surgeons.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-3">Our Mission</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      To advance the science and practice of plastic, reconstructive, and burn surgery 
                      in Yemen and the broader Middle East region through the publication of high-quality 
                      research, clinical studies, and educational content.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <Eye className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-3">Our Vision</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      To become the leading academic journal for plastic and reconstructive surgery 
                      in the Arab world, fostering international collaboration and setting new standards 
                      for surgical excellence and patient care.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                      <Heart className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-3">Our Values</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      We are committed to scientific integrity, ethical publishing practices, 
                      open access to knowledge, and supporting the professional development of 
                      surgeons throughout the region.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Journal Information */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Journal Information</h2>
                <p className="text-muted-foreground">Key facts about YJPRBS</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-background rounded-lg border">
                  <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="font-semibold text-foreground">Founded</div>
                  <div className="text-2xl font-bold text-primary">2011</div>
                </div>
                <div className="text-center p-6 bg-background rounded-lg border">
                  <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="font-semibold text-foreground">Frequency</div>
                  <div className="text-2xl font-bold text-primary">Biannual</div>
                </div>
                <div className="text-center p-6 bg-background rounded-lg border">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="font-semibold text-foreground">Language</div>
                  <div className="text-2xl font-bold text-primary">English</div>
                </div>
                <div className="text-center p-6 bg-background rounded-lg border">
                  <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="font-semibold text-foreground">Access</div>
                  <div className="text-2xl font-bold text-primary">Open</div>
                </div>
              </div>

              <Card className="mt-10">
                <CardContent className="pt-6">
                  <h3 className="font-serif text-xl font-semibold mb-4">Scope & Coverage</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    YJPRBS publishes original research articles, review articles, case reports, technical 
                    notes, and letters to the editor covering all aspects of plastic, reconstructive, 
                    and burn surgery. Topics include but are not limited to:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {[
                      "Aesthetic Surgery",
                      "Burn Care & Reconstruction",
                      "Craniofacial Surgery",
                      "Hand & Upper Extremity Surgery",
                      "Microsurgery",
                      "Pediatric Plastic Surgery",
                      "Breast Reconstruction",
                      "Wound Healing",
                    ].map((topic) => (
                      <div key={topic} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {topic}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* Editorial Board */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Editorial Board</h2>
                <p className="text-muted-foreground">Meet our distinguished team of editors</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {editorialBoard.map((member) => (
                  <Card key={member.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-foreground font-semibold text-lg">
                            {member.name.split(' ').slice(1).map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{member.name}</h4>
                          <Badge variant="outline" className="mt-1 mb-2">{member.role}</Badge>
                          <p className="text-sm text-muted-foreground">{member.affiliation}</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">{member.specialty}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-muted/50 rounded-xl p-8">
                <h3 className="font-serif text-xl font-semibold mb-6 text-center">International Advisory Board</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {advisoryBoard.map((member) => (
                    <div key={member.name} className="text-center p-4 bg-background rounded-lg">
                      <h4 className="font-medium text-foreground text-sm">{member.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{member.affiliation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Contact Information */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground">Get in touch with our editorial office</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-4">Editorial Office</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-foreground">Yemeni Association of Plastic, Reconstructive and Burn Surgeons</p>
                          <p className="text-sm text-muted-foreground">Sana'a, Yemen</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                        <a href="mailto:YemeniAPRBSurgeons@gmail.com" className="text-foreground hover:text-primary transition-colors">
                          YemeniAPRBSurgeons@gmail.com
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-foreground">+967 783331323</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                        <a href="https://www.yafprs.org/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                          www.yafprs.org
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-4">Submission Inquiries</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      For questions about manuscript submission, peer review process, or publication 
                      status, please contact our editorial team.
                    </p>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium text-foreground">Manuscript Submissions</p>
                        <p className="text-xs text-muted-foreground">Submit through our online portal</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium text-foreground">Review Status</p>
                        <p className="text-xs text-muted-foreground">Check your dashboard for updates</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium text-foreground">Technical Support</p>
                        <p className="text-xs text-muted-foreground">Email us for assistance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
