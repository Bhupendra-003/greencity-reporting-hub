
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import issuesData from "../data/issues.json";

interface Issue {
  id: string;
  title: string;
  status: string;
  severity: string;
  created_at: string;
  solution_image_url: string | null;
  solver_id: string | null;
}

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    // Filter issues for the current user
    const userIssues = issuesData.issues.filter(
      (issue) => issue.reporter_id === user?.id
    );
    setIssues(userIssues);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary-dark">
              Citizen Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name}
              </span>
              <Button variant="outline" onClick={() => {}}>
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
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <h3 className="text-2xl font-bold">{issues.length}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-light rounded-full">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">XP Points</p>
                <h3 className="text-2xl font-bold">{user?.xp_points || 0}</h3>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">My Reports</h2>
          <Button onClick={() => navigate("/citizen/report")}>
            Report New Issue
          </Button>
        </div>

        <div className="space-y-4">
          {issues.map((issue) => (
            <Card 
              key={issue.id} 
              className={`p-4 ${
                issue.status === "solved" ? "cursor-pointer hover:bg-gray-50" : ""
              }`}
              onClick={() => {
                if (issue.status === "solved") {
                  setSelectedIssue(issue);
                }
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{issue.title}</h3>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={
                        issue.status === "solved"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }
                    >
                      {issue.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(issue.created_at).toLocaleDateString()}
                  </p>
                </div>
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
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Solved Issue</DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{selectedIssue.title}</h3>
                {selectedIssue.solution_image_url && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Solution Image:</p>
                    <img
                      src={selectedIssue.solution_image_url}
                      alt="Solution"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CitizenDashboard;
