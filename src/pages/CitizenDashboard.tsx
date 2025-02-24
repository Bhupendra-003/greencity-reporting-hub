
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, BarChart2, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CitizenDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Mock data for demonstration
  const reports = [
    {
      id: 1,
      title: "Street Light Malfunction",
      status: "pending",
      date: "2024-02-20",
      location: "Main Street",
    },
    {
      id: 2,
      title: "Garbage Collection Issue",
      status: "solved",
      date: "2024-02-19",
      location: "Park Avenue",
    },
  ];

  const leaderboard = [
    { id: 1, name: "John Doe", xp: 1200 },
    { id: 2, name: "Jane Smith", xp: 1100 },
    { id: 3, name: "Alice Johnson", xp: 900 },
  ];

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
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-light rounded-full">
                <BarChart2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Your XP</p>
                <h3 className="text-2xl font-bold">{user?.xp || 0}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-light rounded-full">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Reports</p>
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

          <Card
            className="p-6 bg-primary cursor-pointer hover:bg-primary-dark transition-colors"
            onClick={() => navigate("/citizen/report")}
          >
            <div className="flex items-center space-x-4 text-white">
              <PlusCircle className="w-6 h-6" />
              <span className="font-semibold">Report New Issue</span>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Reports
            </h2>
            {reports.map((report) => (
              <Card key={report.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600">{report.location}</p>
                    <p className="text-sm text-gray-600">{report.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === "solved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Leaderboard
              </h2>
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div
                    key={user.id}
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
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{user.xp} XP</span>
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

export default CitizenDashboard;
