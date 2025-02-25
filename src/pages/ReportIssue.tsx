
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { MapPin } from "lucide-react";

const ReportIssue = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !severity || !verified || !location) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields and verify you are human",
      });
      return;
    }

    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Report submitted",
        description: "Your issue has been reported successfully",
      });
      navigate("/citizen/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(
            `${position.coords.latitude}, ${position.coords.longitude}`
          );
          toast({
            title: "Location captured",
            description: "Your current location has been recorded",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            variant: "destructive",
            title: "Location error",
            description: "Failed to get your location. Please try again.",
          });
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-2xl">
        <Card className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary-dark mb-2">
              Report an Issue
            </h1>
            <p className="text-gray-600">
              Help us make your community better by reporting issues you observe
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information about the issue"
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select onValueChange={setSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={getLocation}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Capture Location
              </Button>
              {location && (
                <p className="text-sm text-gray-600 mt-1">
                  Location captured: {location}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="verify"
                checked={verified}
                onCheckedChange={(checked) => setVerified(checked as boolean)}
              />
              <label
                htmlFor="verify"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I verify that I am a human and this is a genuine report
              </label>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/citizen/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !verified}>
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ReportIssue;
