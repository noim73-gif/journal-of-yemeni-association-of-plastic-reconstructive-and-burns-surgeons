import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { DoctorProfile } from "@/hooks/useProfile";
import { Loader2, Save, Stethoscope, Globe, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const specialties = [
  "Plastic Surgery",
  "Reconstructive Surgery",
  "Burns",
  "General Surgery",
  "Other",
] as const;

const academicDegrees = [
  "MBBS",
  "MD",
  "MS",
  "MCh",
  "FRCS",
  "FACS",
  "PhD",
  "Fellowship",
  "Diploma",
  "Other",
];

const languages = [
  "Arabic",
  "English",
  "French",
  "German",
  "Turkish",
  "Hindi",
  "Urdu",
  "Other",
];

const formSchema = z.object({
  specialty: z.enum(specialties).optional(),
  academic_degree: z.string().optional(),
  university: z.string().optional(),
  hospital: z.string().optional(),
  years_of_experience: z.number().min(0).max(60).optional(),
  medical_license_number: z.string().optional(),
  research_interests: z.array(z.string()).optional(),
  spoken_languages: z.array(z.string()).optional(),
  is_public_profile: z.boolean().default(false),
  orcid_id: z.string().optional(),
  google_scholar_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfessionalInfoFormProps {
  doctorProfile: DoctorProfile | null;
  onSubmit: (values: Partial<DoctorProfile>) => Promise<{ success: boolean }>;
}

export function ProfessionalInfoForm({ doctorProfile, onSubmit }: ProfessionalInfoFormProps) {
  const [saving, setSaving] = useState(false);
  const [newInterest, setNewInterest] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specialty: doctorProfile?.specialty || undefined,
      academic_degree: doctorProfile?.academic_degree || "",
      university: doctorProfile?.university || "",
      hospital: doctorProfile?.hospital || "",
      years_of_experience: doctorProfile?.years_of_experience || undefined,
      medical_license_number: doctorProfile?.medical_license_number || "",
      research_interests: doctorProfile?.research_interests || [],
      spoken_languages: doctorProfile?.spoken_languages || ["Arabic"],
      is_public_profile: doctorProfile?.is_public_profile || false,
      orcid_id: doctorProfile?.orcid_id || "",
      google_scholar_id: doctorProfile?.google_scholar_id || "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setSaving(true);
    await onSubmit(values as Partial<DoctorProfile>);
    setSaving(false);
  };

  const addResearchInterest = () => {
    if (newInterest.trim()) {
      const current = form.getValues("research_interests") || [];
      if (!current.includes(newInterest.trim())) {
        form.setValue("research_interests", [...current, newInterest.trim()]);
      }
      setNewInterest("");
    }
  };

  const removeResearchInterest = (interest: string) => {
    const current = form.getValues("research_interests") || [];
    form.setValue("research_interests", current.filter((i) => i !== interest));
  };

  const toggleLanguage = (lang: string) => {
    const current = form.getValues("spoken_languages") || [];
    if (current.includes(lang)) {
      form.setValue("spoken_languages", current.filter((l) => l !== lang));
    } else {
      form.setValue("spoken_languages", [...current, lang]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Medical Credentials */}
      <Card className="shadow-elegant">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-serif">Medical Credentials</CardTitle>
              <CardDescription>
                Your medical qualifications and practice information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialty</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {specialties.map((spec) => (
                            <SelectItem key={spec} value={spec}>
                              {spec}
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
                  name="academic_degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Degree</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select degree" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {academicDegrees.map((degree) => (
                            <SelectItem key={degree} value={degree}>
                              {degree}
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
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University / Medical School</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sana'a University" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hospital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital / Workplace</FormLabel>
                      <FormControl>
                        <Input placeholder="Current hospital or clinic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="years_of_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={60}
                          placeholder="Years"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medical_license_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical License Number</FormLabel>
                      <FormControl>
                        <Input placeholder="License number" {...field} />
                      </FormControl>
                      <FormDescription>For verification purposes</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Research Interests */}
              <FormField
                control={form.control}
                name="research_interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Research Interests</FormLabel>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add research interest..."
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addResearchInterest())}
                        />
                        <Button type="button" variant="outline" onClick={addResearchInterest}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((interest) => (
                          <Badge
                            key={interest}
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive/10"
                            onClick={() => removeResearchInterest(interest)}
                          >
                            {interest} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Languages */}
              <FormField
                control={form.control}
                name="spoken_languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spoken Languages</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang) => (
                        <Badge
                          key={lang}
                          variant={field.value?.includes(lang) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleLanguage(lang)}
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Academic IDs */}
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="orcid_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        ORCID ID
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="0000-0000-0000-0000" {...field} />
                      </FormControl>
                      <FormDescription>
                        <a
                          href="https://orcid.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Get your ORCID
                        </a>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="google_scholar_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Google Scholar ID
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Scholar profile ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Public Profile Toggle */}
              <FormField
                control={form.control}
                name="is_public_profile"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Public Profile</FormLabel>
                      <FormDescription>
                        Allow other users to view your professional profile
                      </FormDescription>
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

              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
