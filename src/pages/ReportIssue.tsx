
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, MapPin } from "lucide-react";

const ReportIssue = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !severity) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields",
      });
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement actual report submission
      toast({
        title: "Report submitted",
        description: "Your issue has been reported successfully",
      });
      navigate("/citizen/dashboard");
    } catch (error) {
      console.error("Failed to submit report:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
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

            <div className="grid grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="relative">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                  {image && (
                    <p className="text-sm text-gray-600 mt-1">
                      Image selected: {image.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/citizen/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
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
