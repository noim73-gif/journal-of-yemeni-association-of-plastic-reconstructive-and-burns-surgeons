import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle, AlertCircle, XCircle, Shield, Stethoscope, Edit3, UserCheck } from "lucide-react";
import { Profile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  profile: Profile | null;
  userRoles: string[];
  onAvatarUpload: (file: File) => Promise<{ success: boolean; url: string | null }>;
  isOwnProfile?: boolean;
}

const roleConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  admin: { label: "Administrator", icon: Shield, className: "bg-destructive/10 text-destructive border-destructive/20" },
  editor: { label: "Editor", icon: Edit3, className: "bg-accent/10 text-accent border-accent/20" },
  reviewer: { label: "Reviewer", icon: UserCheck, className: "bg-primary/10 text-primary border-primary/20" },
  doctor: { label: "Doctor", icon: Stethoscope, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  moderator: { label: "Moderator", icon: Shield, className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  member: { label: "Member", icon: UserCheck, className: "bg-muted text-muted-foreground border-border" },
  user: { label: "Member", icon: UserCheck, className: "bg-muted text-muted-foreground border-border" },
};

const statusConfig = {
  verified: { label: "Verified", icon: CheckCircle, className: "text-emerald-600 bg-emerald-500/10" },
  unverified: { label: "Pending Verification", icon: AlertCircle, className: "text-amber-600 bg-amber-500/10" },
  suspended: { label: "Suspended", icon: XCircle, className: "text-destructive bg-destructive/10" },
};

export function ProfileHeader({ profile, userRoles, onAvatarUpload, isOwnProfile = true }: ProfileHeaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    await onAvatarUpload(file);
    setUploading(false);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const status = profile?.account_status || "unverified";
  const StatusIcon = statusConfig[status].icon;

  return (
    <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 md:p-8 text-primary-foreground">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Avatar */}
        <div className="relative group">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary-foreground/20 shadow-elegant">
            <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
            <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground text-2xl md:text-3xl font-serif">
              {getInitials(profile?.full_name)}
            </AvatarFallback>
          </Avatar>
          {isOwnProfile && (
            <>
              <button
                onClick={handleAvatarClick}
                disabled={uploading}
                className={cn(
                  "absolute inset-0 flex items-center justify-center rounded-full",
                  "bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity",
                  "cursor-pointer"
                )}
              >
                <Camera className="h-6 w-6 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold">
              {profile?.full_name || "Complete Your Profile"}
            </h1>
            {profile?.bio && (
              <p className="mt-2 text-primary-foreground/80 max-w-2xl line-clamp-2">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Roles & Status */}
          <div className="flex flex-wrap gap-2">
            {userRoles.length > 0 ? (
              userRoles.map((role) => {
                const config = roleConfig[role] || roleConfig.user;
                const RoleIcon = config.icon;
                return (
                  <Badge
                    key={role}
                    variant="outline"
                    className={cn("gap-1.5 border", config.className)}
                  >
                    <RoleIcon className="h-3 w-3" />
                    {config.label}
                  </Badge>
                );
              })
            ) : (
              <Badge variant="outline" className={roleConfig.member.className}>
                Member
              </Badge>
            )}
            
            <Badge variant="outline" className={cn("gap-1.5", statusConfig[status].className)}>
              <StatusIcon className="h-3 w-3" />
              {statusConfig[status].label}
            </Badge>
          </div>

          {/* Location */}
          {(profile?.city || profile?.country) && (
            <p className="text-sm text-primary-foreground/70">
              📍 {[profile.city, profile.country].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        {/* Member Since */}
        <div className="text-right text-sm text-primary-foreground/70">
          <p>Member since</p>
          <p className="font-medium text-primary-foreground">
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
