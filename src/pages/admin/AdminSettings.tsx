import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, BookOpen, Globe, Hash } from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    journalName: "Journal of Plastic and Reconstructive Surgery",
    abbreviation: "JPRS",
    issn: "",
    eissn: "",
    publisher: "",
    doiPrefix: "10.1234/jprs",
    crossrefUsername: "",
    crossrefPassword: "",
    website: "",
    description: "",
  });

  const handleSave = () => {
    // In a real implementation, this would save to database
    toast({
      title: "Settings saved",
      description: "Your journal settings have been updated.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold mb-2">Journal Settings</h1>
        <p className="text-muted-foreground">
          Configure your journal's metadata for ISSN and Crossref submission
        </p>
      </div>

      {/* Journal Information */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold">
              Journal Information
            </h2>
            <p className="text-sm text-muted-foreground">
              Basic journal metadata
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="journalName">Journal Name</Label>
            <Input
              id="journalName"
              value={settings.journalName}
              onChange={(e) =>
                setSettings({ ...settings, journalName: e.target.value })
              }
              placeholder="Full journal name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="abbreviation">Abbreviation</Label>
            <Input
              id="abbreviation"
              value={settings.abbreviation}
              onChange={(e) =>
                setSettings({ ...settings, abbreviation: e.target.value })
              }
              placeholder="e.g., JPRS"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publisher">Publisher</Label>
            <Input
              id="publisher"
              value={settings.publisher}
              onChange={(e) =>
                setSettings({ ...settings, publisher: e.target.value })
              }
              placeholder="Publisher name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              value={settings.website}
              onChange={(e) =>
                setSettings({ ...settings, website: e.target.value })
              }
              placeholder="https://yourjournal.com"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) =>
                setSettings({ ...settings, description: e.target.value })
              }
              placeholder="Brief description of the journal's scope and mission"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* ISSN Settings */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Hash className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold">
              ISSN Registration
            </h2>
            <p className="text-sm text-muted-foreground">
              International Standard Serial Number for your journal
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="issn">Print ISSN</Label>
            <Input
              id="issn"
              value={settings.issn}
              onChange={(e) =>
                setSettings({ ...settings, issn: e.target.value })
              }
              placeholder="XXXX-XXXX"
            />
            <p className="text-xs text-muted-foreground">
              8-digit code for print edition
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="eissn">Electronic ISSN (eISSN)</Label>
            <Input
              id="eissn"
              value={settings.eissn}
              onChange={(e) =>
                setSettings({ ...settings, eissn: e.target.value })
              }
              placeholder="XXXX-XXXX"
            />
            <p className="text-xs text-muted-foreground">
              8-digit code for online edition
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-2">How to obtain an ISSN</h3>
          <p className="text-sm text-muted-foreground mb-2">
            ISSNs are assigned by the ISSN International Centre or national
            centers. The registration process typically includes:
          </p>
          <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
            <li>Submit your application to your national ISSN center</li>
            <li>Provide journal metadata and a sample publication</li>
            <li>Wait for review and approval (usually 2-4 weeks)</li>
            <li>Receive your unique ISSN number</li>
          </ol>
        </div>
      </div>

      {/* Crossref Settings */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold">
              Crossref Integration
            </h2>
            <p className="text-sm text-muted-foreground">
              DOI registration and metadata deposit
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="doiPrefix">DOI Prefix</Label>
            <Input
              id="doiPrefix"
              value={settings.doiPrefix}
              onChange={(e) =>
                setSettings({ ...settings, doiPrefix: e.target.value })
              }
              placeholder="10.XXXXX/prefix"
            />
            <p className="text-xs text-muted-foreground">
              Assigned by Crossref when you become a member
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="crossrefUsername">Crossref Username</Label>
            <Input
              id="crossrefUsername"
              value={settings.crossrefUsername}
              onChange={(e) =>
                setSettings({ ...settings, crossrefUsername: e.target.value })
              }
              placeholder="Your Crossref username"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="crossrefPassword">Crossref Password</Label>
            <Input
              id="crossrefPassword"
              type="password"
              value={settings.crossrefPassword}
              onChange={(e) =>
                setSettings({ ...settings, crossrefPassword: e.target.value })
              }
              placeholder="Your Crossref password"
            />
            <p className="text-xs text-muted-foreground">
              Used for automated DOI registration
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-2">Crossref Membership Benefits</h3>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Unique DOIs for all your articles</li>
            <li>Enhanced discoverability through metadata registration</li>
            <li>Citation linking and reference matching</li>
            <li>Integration with scholarly databases</li>
          </ul>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
