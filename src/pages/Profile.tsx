import { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileOverview } from "@/components/profile/ProfileOverview";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { ProfessionalInfoForm } from "@/components/profile/ProfessionalInfoForm";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { 
    profile, 
    doctorProfile, 
    loginActivity, 
    userRoles, 
    loading, 
    updateProfile, 
    updateDoctorProfile, 
    uploadAvatar,
    updateNotificationPreferences 
  } = useProfile();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          userRoles={userRoles}
          onAvatarUpload={uploadAvatar}
        />

        {/* Content */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <ProfileSidebar userRoles={userRoles} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="min-w-0">
            <Routes>
              <Route index element={<ProfileOverview profile={profile} doctorProfile={doctorProfile} userRoles={userRoles} />} />
              <Route path="personal" element={<PersonalInfoForm profile={profile} onSubmit={updateProfile} />} />
              <Route path="professional" element={<ProfessionalInfoForm doctorProfile={doctorProfile} onSubmit={updateDoctorProfile} />} />
              <Route path="settings" element={<ProfileSettings profile={profile} loginActivity={loginActivity} onUpdateNotifications={updateNotificationPreferences} />} />
            </Routes>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
