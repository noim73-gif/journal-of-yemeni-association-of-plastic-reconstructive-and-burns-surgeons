import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Users, Award, Clock, FileText } from "lucide-react";

const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  institution: z.string().min(2, "Institution name is required").max(200),
  department: z.string().min(2, "Department is required").max(200),
  academicTitle: z.string().min(1, "Please select your academic title"),
  specialty: z.string().min(2, "Specialty/field of expertise is required").max(200),
  orcidId: z.string().optional(),
  googleScholarId: z.string().optional(),
  yearsExperience: z.string().min(1, "Please select your years of experience"),
  publicationsCount: z.string().min(1, "Please select your publication count"),
  previousReviewExperience: z.string().max(1000).optional(),
  areasOfExpertise: z.string().min(10, "Please describe your areas of expertise").max(1000),
  motivation: z.string().min(50, "Please provide at least 50 characters").max(2000),
  cvUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  agreeToGuidelines: z.boolean().refine((val) => val === true, {
    message: "You must agree to the reviewer guidelines",
  }),
  agreeToConfidentiality: z.boolean().refine((val) => val === true, {
    message: "You must agree to maintain confidentiality",
  }),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const specialties = [
  "General Surgery",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Obstetrics & Gynecology",
  "Internal Medicine",
  "Oncology",
  "Dermatology",
  "Psychiatry",
  "Emergency Medicine",
  "Radiology",
  "Anesthesiology",
  "Pathology",
  "Public Health",
  "Other",
];

const benefits = [
  {
    icon: Award,
    title: "Recognition",
    description: "Receive acknowledgment in our annual reviewer recognition program",
  },
  {
    icon: FileText,
    title: "Early Access",
    description: "Be among the first to read cutting-edge research in your field",
  },
  {
    icon: Users,
    title: "Network",
    description: "Connect with leading researchers and clinicians in Yemen and beyond",
  },
  {
    icon: Clock,
    title: "Flexibility",
    description: "Review manuscripts at your own pace with reasonable deadlines",
  },
];

const requirements = [
  "Hold a doctoral degree (MD, PhD, or equivalent) in a relevant field",
  "Have at least 3 years of research or clinical experience",
  "Published at least 5 peer-reviewed articles as an author",
  "Demonstrate expertise in medical or surgical specialties",
  "Commit to providing timely, constructive, and unbiased reviews",
  "Maintain strict confidentiality of manuscript contents",
];

export default function BecomeReviewer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      institution: "",
      department: "",
      academicTitle: "",
      specialty: "",
      orcidId: "",
      googleScholarId: "",
      yearsExperience: "",
      publicationsCount: "",
      previousReviewExperience: "",
      areasOfExpertise: "",
      motivation: "",
      cvUrl: "",
      agreeToGuidelines: false,
      agreeToConfidentiality: false,
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log("Reviewer application submitted:", data);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Application Submitted",
      description: "Thank you for your interest. We will review your application and contact you soon.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Application Submitted Successfully
            </h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your interest in becoming a reviewer for the Journal of Yemeni 
              Medical and Surgical Sciences. Our editorial team will review your application 
              and contact you within 2-3 weeks.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Return to Homepage
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">Join Our Team</Badge>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Become a Peer Reviewer
              </h1>
              <p className="text-xl text-muted-foreground">
                Join our distinguished panel of reviewers and contribute to advancing 
                medical knowledge in Yemen and the broader region.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Benefits of Reviewing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {benefits.map((benefit) => (
                    <div key={benefit.title} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <benefit.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                  <CardDescription>
                    To be considered for our reviewer panel, applicants should:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {requirements.map((requirement, index) => (
                      <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Reviewer Application Form</CardTitle>
                  <CardDescription>
                    Please complete all required fields. Your application will be reviewed 
                    by our editorial board.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Personal Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Dr. Ahmed Mohammed" {...field} />
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
                                <FormLabel>Email Address *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="ahmed@university.edu" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="institution"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Institution/Hospital *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Sana'a University" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Department of Surgery" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="academicTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Academic Title *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select title" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="professor">Professor</SelectItem>
                                    <SelectItem value="associate_professor">Associate Professor</SelectItem>
                                    <SelectItem value="assistant_professor">Assistant Professor</SelectItem>
                                    <SelectItem value="lecturer">Lecturer</SelectItem>
                                    <SelectItem value="senior_consultant">Senior Consultant</SelectItem>
                                    <SelectItem value="consultant">Consultant</SelectItem>
                                    <SelectItem value="specialist">Specialist</SelectItem>
                                    <SelectItem value="researcher">Researcher</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="specialty"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Specialty *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select specialty" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {specialties.map((specialty) => (
                                      <SelectItem key={specialty} value={specialty.toLowerCase().replace(/\s+/g, "_")}>
                                        {specialty}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Academic Profile */}
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Academic Profile
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="orcidId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ORCID ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="0000-0000-0000-0000" {...field} />
                                </FormControl>
                                <FormDescription>Optional but recommended</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="googleScholarId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Google Scholar Profile</FormLabel>
                                <FormControl>
                                  <Input placeholder="Scholar profile URL" {...field} />
                                </FormControl>
                                <FormDescription>Optional</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="yearsExperience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years of Experience *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select range" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="3-5">3-5 years</SelectItem>
                                    <SelectItem value="6-10">6-10 years</SelectItem>
                                    <SelectItem value="11-15">11-15 years</SelectItem>
                                    <SelectItem value="16-20">16-20 years</SelectItem>
                                    <SelectItem value="20+">More than 20 years</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="publicationsCount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Number of Publications *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select range" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="5-10">5-10 publications</SelectItem>
                                    <SelectItem value="11-25">11-25 publications</SelectItem>
                                    <SelectItem value="26-50">26-50 publications</SelectItem>
                                    <SelectItem value="51-100">51-100 publications</SelectItem>
                                    <SelectItem value="100+">More than 100</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Experience & Expertise */}
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Experience & Expertise
                        </h3>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="areasOfExpertise"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Areas of Expertise *</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Describe your specific areas of expertise and research interests..."
                                    className="min-h-[100px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  List the topics you feel qualified to review
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="previousReviewExperience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Previous Review Experience</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="List any journals you have reviewed for previously..."
                                    className="min-h-[80px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>Optional</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="motivation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Motivation Statement *</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Why do you want to become a reviewer for JYMSS? What can you contribute to our journal?"
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Minimum 50 characters
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cvUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CV/Resume Link</FormLabel>
                                <FormControl>
                                  <Input
                                    type="url"
                                    placeholder="https://drive.google.com/your-cv"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Optional: Link to your CV (Google Drive, Dropbox, etc.)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Agreements */}
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Agreements
                        </h3>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="agreeToGuidelines"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    I agree to follow the journal's reviewer guidelines and 
                                    provide constructive, unbiased feedback *
                                  </FormLabel>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="agreeToConfidentiality"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    I agree to maintain strict confidentiality of all 
                                    manuscripts and review materials *
                                  </FormLabel>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting Application..." : "Submit Application"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
