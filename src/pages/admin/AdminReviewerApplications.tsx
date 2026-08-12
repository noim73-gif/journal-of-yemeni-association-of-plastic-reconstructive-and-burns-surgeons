import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Users } from "lucide-react";
import {
  useReviewerApplicationsAdmin,
  ApplicationStatus,
} from "@/hooks/useReviewerApplications";
import { ReviewerApplicationCard } from "@/components/admin/ReviewerApplicationCard";
import { EmptyState } from "@/components/EmptyState";

const statusTabs: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminReviewerApplications() {
  const { data: applications, isLoading } = useReviewerApplicationsAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ApplicationStatus | "all">("all");

  const filteredApplications = applications?.filter((app) => {
    const matchesSearch =
      searchQuery === "" ||
      app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.institution.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeTab === "all" || app.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const getStatusCount = (status: ApplicationStatus | "all") => {
    if (!applications) return 0;
    if (status === "all") return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h1">
            Reviewer Applications
          </h1>
          <p className="text-lead mt-2">
            Review and manage applications from researchers wanting to join the review panel
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusTabs.map((tab) => (
          <Card
            key={tab.value}
            className={`cursor-pointer transition-colors ${
              activeTab === tab.value ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            <CardContent className="p-4">
              <div className="text-stat">{getStatusCount(tab.value)}</div>
              <div className="text-overline mt-1">{tab.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or institution..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Applications List */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ApplicationStatus | "all")}>
        <TabsList>
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
              {tab.label}
              <Badge variant="secondary" className="ml-1">
                {getStatusCount(tab.value)}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {!filteredApplications || filteredApplications.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No applications found"
              description={
                searchQuery
                  ? "Try adjusting your search query."
                  : "Applications from researchers who want to join the review panel will appear here."
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <ReviewerApplicationCard
                  key={application.id}
                  application={application}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
