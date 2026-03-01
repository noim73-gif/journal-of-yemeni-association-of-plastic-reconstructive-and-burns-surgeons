import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Mail, CheckCircle2, Shield, KeyRound, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const professions = [
  "Surgeon",
  "Physician",
  "Resident",
  "Medical Student",
  "Nurse",
  "Researcher",
  "Academic/Professor",
  "Other Healthcare Professional",
];

const specialties = [
  "Plastic Surgery",
  "Reconstructive Surgery",
  "Burn Surgery",
  "Hand Surgery",
  "Craniofacial Surgery",
  "Microsurgery",
  "Aesthetic/Cosmetic Surgery",
  "Maxillofacial Surgery",
  "General Surgery",
  "Dermatology",
  "Orthopedic Surgery",
  "ENT Surgery",
  "Ophthalmology",
  "Emergency Medicine",
  "Other",
];

export default function Auth() {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profession, setProfession] = useState("");
  const [primarySpecialty, setPrimarySpecialty] = useState("");
  const [additionalSpecialties, setAdditionalSpecialties] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [acceptEula, setAcceptEula] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; firstName?: string; lastName?: string; profession?: string; specialty?: string; agreements?: string }>({});
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetSent, setShowResetSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validate = (isSignUp = false) => {
    const newErrors: typeof errors = {};
    
    const emailResult = z.string().email("Please enter a valid email address").safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = z.string().min(6, "Password must be at least 6 characters").safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (isSignUp) {
      if (!firstName.trim()) newErrors.firstName = "First name is required";
      if (!lastName.trim()) newErrors.lastName = "Last name is required";
      if (!profession) newErrors.profession = "Please select your profession";
      if (!primarySpecialty) newErrors.specialty = "Please select your primary specialty";
      if (!acceptEula || !acceptPrivacy) newErrors.agreements = "You must accept both agreements";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = () => {
    const emailResult = z.string().email("Please enter a valid email address").safeParse(resetEmail);
    if (!emailResult.success) {
      setErrors({ email: emailResult.error.errors[0].message });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      let errorMessage = error.message;
      if (error.message === "Invalid login credentials") {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email before signing in. Check your inbox for the verification link.";
      }
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have signed in successfully.",
      });
      navigate("/");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(true)) return;

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    setLoading(true);
    const { error } = await signUp(email, password, fullName, {
      profession,
      primary_specialty: primarySpecialty,
      additional_specialties: additionalSpecialties || undefined,
      postal_code: postalCode || undefined,
    });
    setLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast({
          title: "Account exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      setRegisteredEmail(email);
      setShowVerificationMessage(true);
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setProfession("");
      setPrimarySpecialty("");
      setAdditionalSpecialties("");
      setPostalCode("");
      setAcceptEula(false);
      setAcceptPrivacy(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth`,
    });
    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setShowResetSent(true);
    }
  };

  // Password reset sent confirmation screen
  if (showResetSent) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border p-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Journal
          </Button>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">Check Your Email</CardTitle>
              <CardDescription className="text-base">
                We've sent password reset instructions to
              </CardDescription>
              <p className="font-medium text-foreground">{resetEmail}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Check your inbox</p>
                    <p className="text-sm text-muted-foreground">
                      Click the reset link in the email to create a new password.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <KeyRound className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Create a strong password</p>
                    <p className="text-sm text-muted-foreground">
                      Use at least 6 characters with a mix of letters and numbers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Didn't receive the email? Check your spam folder.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setShowResetSent(false);
                    setShowForgotPassword(false);
                    setResetEmail("");
                  }}
                >
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Forgot password form
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border p-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Journal
          </Button>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <KeyRound className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">Reset Your Password</CardTitle>
              <CardDescription className="text-base">
                Enter your email address and we'll send you instructions to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Instructions
                </Button>
                
                <Button 
                  type="button"
                  variant="ghost" 
                  className="w-full"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail("");
                    setErrors({});
                  }}
                >
                  Back to Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (showVerificationMessage) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border p-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Journal
          </Button>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">Verify Your Email</CardTitle>
              <CardDescription className="text-base">
                We've sent a verification link to
              </CardDescription>
              <p className="font-medium text-foreground">{registeredEmail}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Check your inbox</p>
                    <p className="text-sm text-muted-foreground">
                      Click the verification link in the email we sent you.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Secure access</p>
                    <p className="text-sm text-muted-foreground">
                      Email verification protects your account and ensures secure access.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Didn't receive the email? Check your spam folder.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowVerificationMessage(false)}
                >
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border p-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Journal
        </Button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
              <span className="font-serif text-primary-foreground font-bold text-2xl">J</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Journal of Plastic & Reconstructive Surgery
            </h1>
            <p className="text-muted-foreground mt-2">
              Sign in to save articles and track your reading history
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password">Password</Label>
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 h-auto font-normal text-sm text-muted-foreground hover:text-primary"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firstname">First Name *</Label>
                    <Input
                      id="signup-firstname"
                      type="text"
                      placeholder="Jane"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={loading}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-lastname">Last Name *</Label>
                    <Input
                      id="signup-lastname"
                      type="text"
                      placeholder="Smith"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={loading}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address *</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signup-password">Password *</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto px-2 py-1 text-xs gap-1"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </div>
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Profession / Role *</Label>
                  <Select value={profession} onValueChange={setProfession} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your profession or role" />
                    </SelectTrigger>
                    <SelectContent>
                      {professions.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.profession && (
                    <p className="text-sm text-destructive">{errors.profession}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Primary Specialty *</Label>
                  <Select value={primarySpecialty} onValueChange={setPrimarySpecialty} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your primary specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.specialty && (
                    <p className="text-sm text-destructive">{errors.specialty}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Additional Specialties of Interest</Label>
                    <span className="text-xs text-muted-foreground">Optional</span>
                  </div>
                  <Select value={additionalSpecialties} onValueChange={setAdditionalSpecialties} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose additional specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-postal">Postal Code</Label>
                  <Input
                    id="signup-postal"
                    type="text"
                    placeholder="Enter your postal code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="accept-eula"
                      checked={acceptEula}
                      onCheckedChange={(checked) => setAcceptEula(checked === true)}
                      disabled={loading}
                    />
                    <Label htmlFor="accept-eula" className="text-sm font-normal cursor-pointer">
                      I accept the <a href="/publication-ethics" className="text-primary underline hover:no-underline">End User License Agreement</a>
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="accept-privacy"
                      checked={acceptPrivacy}
                      onCheckedChange={(checked) => setAcceptPrivacy(checked === true)}
                      disabled={loading}
                    />
                    <Label htmlFor="accept-privacy" className="text-sm font-normal cursor-pointer">
                      I accept the <a href="/publication-ethics" className="text-primary underline hover:no-underline">Privacy Policy</a>
                    </Label>
                  </div>
                  {errors.agreements && (
                    <p className="text-sm text-destructive">{errors.agreements}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 shrink-0" />
                  <span>You'll receive a verification email to confirm your account</span>
                </div>
                <Button type="submit" className="w-full" disabled={loading || !acceptEula || !acceptPrivacy}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}