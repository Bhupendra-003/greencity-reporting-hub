
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

### What's next?
- **Refine & Customize**: Tweak the design, animations, and layouts via prompts or visual edits.  Focus on the green and environment-related color palette.
- **Master Prompting**: Use clear, detailed, and iterative prompts for better outcomes.
- **Expand with Backend**: Connect Supabase for authentication, database management (users, NGOs, reports), and integrate the necessary APIs for map functionality and email notifications. Implement the human verification step before report submission. Award NGOs 200 XP points for each solved issue.
- **GitHub Sync**: Transfer your project's code to GitHub for two-way sync of edits.
- **Debug with Ease**: Activate our experimental “chat mode” to troubleshoot issues quickly.
- **Add project knowledge**: Set key context or custom instructions you want to include in every edit in this project.

<lov-actions>
<lov-knowledge>
</lov-actions>

<lov-actions>
<lov-message-prompt message="Tell me more about Supabase">Explore Supabase</lov-message-prompt>
</lov-actions>

<lov-actions>
<lov-link url="https://docs.lovable.dev/">Visit docs</lov-link>
</lov-actions>
