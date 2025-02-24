
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Trophy, CheckCircle, MapPin } from "lucide-react";

const NGODashboard = () => {
  const { user, logout } = useAuth();

  // Mock data for demonstration
  const reports = [
    {
      id: 1,
      title: "Street Light Malfunction",
      status: "pending",
      priority: "high",
      date: "2024-02-20",
      location: "Main Street",
      reporter: "John Doe",
    },
    {
      id: 2,
      title: "Garbage Collection Issue",
      status: "pending",
      priority: "medium",
      date: "2024-02-19",
      location: "Park Avenue",
      reporter: "Jane Smith",
    },
  ];

  const ngoLeaderboard = [
    { id: 1, name: "Green Earth NGO", xp: 2400 },
    { id: 2, name: "City Helpers", xp: 2200 },
    { id: 3, name: "Urban Care", xp: 1800 },
  ];

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
              <Button variant="outline" onClick={logout}>
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
                <p className="text-sm text-gray-600">NGO Rating</p>
                <h3 className="text-2xl font-bold">{user?.xp || 0} XP</h3>
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
                  {reports.filter((r) => r.status === "pending").length}
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
                  {reports.filter((r) => r.status === "solved").length}
                </h3>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Active Reports
            </h2>
            {reports.map((report) => (
              <Card key={report.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      {report.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      Reported by: {report.reporter}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {report.date}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        report.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : report.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {report.priority}
                    </span>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                NGO Leaderboard
              </h2>
              <div className="space-y-4">
                {ngoLeaderboard.map((ngo, index) => (
                  <div
                    key={ngo.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                          index === 0
                            ? "bg-yellow-400 text-white"
                            : index === 1
                            ? "bg-gray-300 text-gray-800"
                            : index === 2
                            ? "bg-amber-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="font-medium">{ngo.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{ngo.xp} XP</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NGODashboard;
