import { Button, type ButtonProps } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useUserStore } from "@/lib/userStore";
import { useToast } from "@/hooks/use-toast";

type ButtonVariant = NonNullable<ButtonProps['variant']>;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const { name, username, email, phone, avatarInitials, memberSince, setUser } = useUserStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name,
    username,
    email,
    phone
  });

  const handlePhotoSelection = (useCamera: boolean) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;
    
    if (useCamera) {
      input.capture = 'environment';
    }
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please select an image smaller than 5MB",
            variant: "destructive"
          });
          URL.revokeObjectURL(imageUrl);
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: "Please select a valid image file",
            variant: "destructive"
          });
          URL.revokeObjectURL(imageUrl);
          return;
        }
        
        const img = new Image();
        img.onload = () => {
          toast({
            title: "Photo updated successfully! 📸",
            description: `${useCamera ? 'Camera photo' : 'Gallery photo'} selected: ${file.name}`
          });
          
          console.log('Photo ready for upload:', {
            name: file.name,
            size: file.size,
            type: file.type,
            url: imageUrl
          });
          
          setTimeout(() => URL.revokeObjectURL(imageUrl), 5000);
        };
        
        img.onerror = () => {
          toast({
            title: "Error loading image",
            description: "Please try selecting a different image",
            variant: "destructive"
          });
          URL.revokeObjectURL(imageUrl);
        };
        
        img.src = imageUrl;
      }
    };
    
    input.click();
    setShowPhotoOptions(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };
  
  const handleSave = () => {
    // Update initials based on new name
    const nameParts = formData.name.split(' ');
    const newInitials = nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}` 
      : formData.name.substring(0, 2);
    
    // Update user store
    setUser({ 
      ...formData,
      avatarInitials: newInitials.toUpperCase()
    });
    
    // Show success toast
    toast({
      title: "Changes saved",
      description: "Your profile has been updated"
    });
  };

  return (
    <div className="p-4 pb-6">
      <div className="pt-2 pb-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="flex border-b border-neutral-200 dark:border-neutral-700 mb-4 overflow-x-auto hide-scrollbar">
        <button 
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "profile" ? "text-primary border-b-2 border-primary" : "text-neutral-500"}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "appearance" ? "text-primary border-b-2 border-primary" : "text-neutral-500"}`}
          onClick={() => setActiveTab("appearance")}
        >
          Appearance
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "notifications" ? "text-primary border-b-2 border-primary" : "text-neutral-500"}`}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "privacy" ? "text-primary border-b-2 border-primary" : "text-neutral-500"}`}
          onClick={() => setActiveTab("privacy")}
        >
          Privacy
        </button>
      </div>
      
      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div>
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-lg text-white font-medium">
                  {avatarInitials}
                </div>
                <div>
                  <h3 className="font-medium">{name}</h3>
                  <p className="text-xs text-neutral-400">Member since {memberSince}</p>
                </div>
              </div>
              
              {!showPhotoOptions ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setShowPhotoOptions(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                  Change Photo
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handlePhotoSelection(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    Take a new Photo
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handlePhotoSelection(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"></path>
                    </svg>
                    Choose from Gallery
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setShowPhotoOptions(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={handleChange}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input 
                id="username" 
                value={formData.username} 
                onChange={handleChange}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={formData.phone} 
                onChange={handleChange}
                className="mt-1" 
              />
            </div>
            
            <Button 
              className="w-full bg-primary hover:bg-primary/90 mt-2"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}
      
      {/* Appearance Tab */}
      {activeTab === "appearance" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-neutral-400">Enable dark theme for the app</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-2">Measurement Units</h3>
                  <div className="flex gap-2">
                    <Button variant="default" className="flex-1 bg-primary text-white">Imperial</Button>
                    <Button variant="outline" className="flex-1">Metric</Button>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-2">Language</h3>
                  <select className="w-full px-3 py-2 rounded border border-neutral-200 dark:border-neutral-700 bg-transparent">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Workout Reminders</h3>
                    <p className="text-sm text-neutral-400">Get notified before workouts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <div>
                    <h3 className="font-medium">Progress Updates</h3>
                    <p className="text-sm text-neutral-400">Weekly progress summaries</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <div>
                    <h3 className="font-medium">AI Coach Tips</h3>
                    <p className="text-sm text-neutral-400">Tips from your AI trainer</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-neutral-400">Receive updates via email</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Show Profile</h3>
                    <p className="text-sm text-neutral-400">Allow others to see your profile</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <div>
                    <h3 className="font-medium">Share Workout Data</h3>
                    <p className="text-sm text-neutral-400">Allow friends to see your workouts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <div>
                    <h3 className="font-medium">Data Collection</h3>
                    <p className="text-sm text-neutral-400">Help improve the app</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <Button variant="outline" className="w-full text-red-500 mt-2">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}