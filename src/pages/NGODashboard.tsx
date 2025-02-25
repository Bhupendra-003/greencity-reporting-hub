
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Trophy, CheckCircle } from "lucide-react";

// Mock data for development
const mockIssues = [
  {
    id: "1",
    title: "Broken Street Light",
    description: "Street light not working on Main Street",
    status: "pending",
    severity: "medium",
    location: "123 Main St",
    created_at: "2024-02-20"
  },
  {
    id: "2",
    title: "Garbage Collection",
    description: "Garbage not collected for 3 days",
    status: "solved",
    severity: "high",
    location: "456 Oak Ave",
    created_at: "2024-02-19"
  }
];

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  location: string;
  created_at: string;
}

const NGODashboard = () => {
  const { user } = useAuth();
  const [issues] = useState<Issue[]>(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary-dark">NGO Dashboard</h1>
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
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">XP Points</p>
                <h3 className="text-2xl font-bold">{user?.xp_points || 0}</h3>
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
                  {issues.filter((i) => i.status === "solved").length}
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
                  <p className="text-sm text-gray-600">{issue.location}</p>
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
    </div>
  );
};

export default NGODashboard;
