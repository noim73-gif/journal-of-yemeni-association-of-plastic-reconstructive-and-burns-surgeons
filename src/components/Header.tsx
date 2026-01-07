import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, User, LogOut, Bookmark, Settings, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const navItems = [{
  label: "Current Issue",
  href: "#current-issue"
}, {
  label: "Articles",
  href: "/articles",
  isRoute: true
}, {
  label: "Archive",
  href: "/archive",
  isRoute: true
}, {
  label: "Submit",
  href: "/submit",
  isRoute: true
}, {
  label: "About",
  href: "#about"
}];
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    user,
    signOut,
    loading
  } = useAuth();
  const {
    isAdmin
  } = useAdmin();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  return <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <span className="font-serif text-primary-foreground font-bold text-lg">YJ</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-lg font-semibold text-foreground leading-tight">YJPRBS  <br className="hidden lg:block" /> ​ 
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(item => 
              item.isRoute ? (
                <Link key={item.label} to={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </a>
              )
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Search className="h-5 w-5" />
            </Button>
            
            {!loading && <>
                {user ? <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                        <Bookmark className="mr-2 h-4 w-4" />
                        My Library
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/submit")} className="cursor-pointer">
                        <Send className="mr-2 h-4 w-4" />
                        Submit Manuscript
                      </DropdownMenuItem>
                      {isAdmin && <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </DropdownMenuItem>
                        </>}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> : <Button variant="accent" size="sm" onClick={() => navigate("/auth")} className="hidden sm:flex">
                    Sign In
                  </Button>}
              </>}
            
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navItems.map(item => 
                item.isRoute ? (
                  <Link key={item.label} to={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
                ) : (
                  <a key={item.label} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                  </a>
                )
              )}
              {user ? <>
                  <Button variant="ghost" size="sm" className="w-fit justify-start" onClick={() => {
              navigate("/dashboard");
              setMobileMenuOpen(false);
            }}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    My Library
                  </Button>
                  <Button variant="ghost" size="sm" className="w-fit justify-start text-destructive" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </> : <Button variant="accent" size="sm" className="w-fit" onClick={() => {
            navigate("/auth");
            setMobileMenuOpen(false);
          }}>
                  Sign In
                </Button>}
            </div>
          </nav>}
      </div>
    </header>;
}