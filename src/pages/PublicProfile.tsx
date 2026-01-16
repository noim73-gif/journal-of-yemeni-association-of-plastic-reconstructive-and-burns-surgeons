import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Stethoscope, 
  GraduationCap, 
  Building2, 
  Award,
  Languages,
  Search,
  ExternalLink,
  User,
  ArrowLeft
} from "lucide-react";
import { Profile, DoctorProfile } from "@/hooks/useProfile";

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      if (!username) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        // Fetch profile by username
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .single();

        if (profileError || !profileData) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        // Check if the doctor profile is public
        const { data: doctorData, error: doctorError } = await supabase
          .from("doctor_profiles")
          .select("*")
          .eq("user_id", profileData.user_id)
          .eq("is_public_profile", true)
          .single();

        if (doctorError && doctorError.code !== "PGRST116") {
          console.error("Error fetching doctor profile:", doctorError);
        }

        // Only show the profile if either the doctor profile is public
        if (!doctorData) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setProfile({
          ...profileData,
          account_status: profileData.account_status as Profile["account_status"],
          notification_preferences: profileData.notification_preferences as Profile["notification_preferences"],
        });
        setDoctorProfile(doctorData as DoctorProfile);
      } catch (error) {
        console.error("Error fetching public profile:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container max-w-4xl py-8">
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container max-w-4xl py-8">
          <Card className="text-center py-16">
            <CardContent>
              <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h1 className="text-2xl font-serif font-bold mb-2">Profile Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The profile you're looking for doesn't exist or is not public.
              </p>
              <Button asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-4xl py-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="shadow-elegant overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5" />
            <CardContent className="relative pt-0">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                  <AvatarFallback className="text-2xl font-serif bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 pb-2">
                  <h1 className="text-2xl font-serif font-bold">{profile?.full_name}</h1>
                  <p className="text-muted-foreground">@{profile?.username}</p>
                </div>
              </div>
              
              {profile?.bio && (
                <p className="mt-4 text-muted-foreground">{profile.bio}</p>
              )}

              {(profile?.city || profile?.country) && (
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {[profile?.city, profile?.country].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Information */}
          {doctorProfile && (
            <Card className="shadow-elegant">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-serif">Professional Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {doctorProfile.specialty && (
                    <div className="flex items-start gap-3">
                      <Stethoscope className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Specialty</p>
                        <p className="font-medium">{doctorProfile.specialty}</p>
                      </div>
                    </div>
                  )}

                  {doctorProfile.academic_degree && (
                    <div className="flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Academic Degree</p>
                        <p className="font-medium">{doctorProfile.academic_degree}</p>
                      </div>
                    </div>
                  )}

                  {doctorProfile.university && (
                    <div className="flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">University</p>
                        <p className="font-medium">{doctorProfile.university}</p>
                      </div>
                    </div>
                  )}

                  {doctorProfile.hospital && (
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Workplace</p>
                        <p className="font-medium">{doctorProfile.hospital}</p>
                      </div>
                    </div>
                  )}

                  {doctorProfile.years_of_experience && (
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Experience</p>
                        <p className="font-medium">{doctorProfile.years_of_experience} years</p>
                      </div>
                    </div>
                  )}

                  {doctorProfile.spoken_languages && doctorProfile.spoken_languages.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Languages className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Languages</p>
                        <p className="font-medium">{doctorProfile.spoken_languages.join(", ")}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Research Interests */}
                {doctorProfile.research_interests && doctorProfile.research_interests.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center gap-2 mb-3">
                      <Search className="h-5 w-5 text-muted-foreground" />
                      <p className="font-medium">Research Interests</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {doctorProfile.research_interests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Academic IDs */}
                {(doctorProfile.orcid_id || doctorProfile.google_scholar_id) && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="font-medium mb-3">Academic Profiles</p>
                    <div className="flex flex-wrap gap-3">
                      {doctorProfile.orcid_id && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://orcid.org/${doctorProfile.orcid_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            ORCID
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </a>
                        </Button>
                      )}
                      {doctorProfile.google_scholar_id && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://scholar.google.com/citations?user=${doctorProfile.google_scholar_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Google Scholar
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}