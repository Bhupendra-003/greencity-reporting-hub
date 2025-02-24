
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Trophy, CheckCircle, MapPin, X, Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  location: string;
  image_url: string | null;
  solution_image_url: string | null;
  reporter_id: string;
  solver_id: string | null;
  created_at: string;
}

const NGODashboard = () => {
  const { user, profile } = useAuth();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [solutionImage, setSolutionImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchIssues();
    // Subscribe to realtime updates
    const channel = supabase
      .channel('issues-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'issues'
        },
        () => {
          fetchIssues();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchIssues = async () => {
    try {
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const handleSolutionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSolutionImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolveIssue = async () => {
    if (!selectedIssue || !solutionImage) {
      toast({
        variant: "destructive",
        title: "Missing solution image",
        description: "Please upload an image of the solved issue",
      });
      return;
    }

    try {
      setLoading(true);

      // Upload solution image
      const fileExt = solutionImage.name.split(".").pop();
      const fileName = `solution-${Math.random()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from("solution-images")
        .upload(fileName, solutionImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("solution-images")
        .getPublicUrl(fileName);

      // Update issue status
      const { error: updateError } = await supabase
        .from("issues")
        .update({
          status: "solved",
          solution_image_url: publicUrl,
          solver_id: user?.id,
          solved_at: new Date().toISOString(),
        })
        .eq("id", selectedIssue.id);

      if (updateError) throw updateError;

      toast({
        title: "Issue solved",
        description: "The issue has been marked as solved successfully",
      });

      setSelectedIssue(null);
      setSolutionImage(null);
      setImagePreview(null);
      await fetchIssues();
    } catch (error: any) {
      console.error("Error solving issue:", error);
      toast({
        variant: "destructive",
        title: "Failed to solve issue",
        description: error.message || "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary-dark">NGO Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {profile?.name}
              </span>
              <Button variant="outline" onClick={() => supabase.auth.signOut()}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-light rounded-full">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">XP Points</p>
                <h3 className="text-2xl font-bold">{profile?.xp_points || 0}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-light rounded-full">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Issues</p>
                <h3 className="text-2xl font-bold">
                  {issues.filter((i) => i.status === "pending").length}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-light rounded-full">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Solved Issues</p>
                <h3 className="text-2xl font-bold">
                  {issues.filter((i) => i.status === "solved" && i.solver_id === user?.id).length}
                </h3>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Active Reports</h2>
          {issues.map((issue) => (
            <Card key={issue.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{issue.title}</h3>
                  <p className="text-sm text-gray-600">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {issue.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {issue.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(issue.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      issue.severity === "high"
                        ? "bg-red-100 text-red-800"
                        : issue.severity === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {issue.severity}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setSelectedIssue(issue)}
                    disabled={issue.status === "solved"}
                  >
                    {issue.status === "solved" ? "Solved" : "View Details"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={!!selectedIssue} onOpenChange={() => {
        setSelectedIssue(null);
        setSolutionImage(null);
        setImagePreview(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Issue Details
            </DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{selectedIssue.title}</h3>
                <p className="text-sm text-gray-600">{selectedIssue.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-sm">{selectedIssue.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-sm capitalize">{selectedIssue.status}</p>
                </div>
              </div>

              {selectedIssue.image_url && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Issue Image</p>
                  <img
                    src={selectedIssue.image_url}
                    alt="Issue"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {selectedIssue.status === "pending" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="solution-image">Solution Image</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        id="solution-image"
                        accept="image/*"
                        onChange={handleSolutionImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById("solution-image")?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Solution Image
                      </Button>
                    </div>
                  </div>

                  {imagePreview && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Solution Preview</p>
                      <img
                        src={imagePreview}
                        alt="Solution Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                {selectedIssue.status === "pending" && (
                  <Button
                    onClick={handleSolveIssue}
                    disabled={!solutionImage || loading}
                  >
                    {loading ? "Solving..." : "Mark as Solved"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NGODashboard;
