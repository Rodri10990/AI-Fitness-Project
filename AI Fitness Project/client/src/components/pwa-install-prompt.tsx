import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already dismissed this session
  if (sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  // Show iOS instructions
  if (isIOS && !showPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
        <div className="flex items-start gap-3">
          <Smartphone className="w-6 h-6 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Install FitTrainer</h3>
            <p className="text-sm opacity-90">
              Tap the share button <span className="font-bold">⎋</span> and select "Add to Home Screen" to install this app!
            </p>
          </div>
          <button onClick={handleDismiss} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Show Android install prompt
  if (showPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
        <div className="flex items-start gap-3">
          <Download className="w-6 h-6 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Install FitTrainer</h3>
            <p className="text-sm opacity-90 mb-3">
              Get the full app experience! Install FitTrainer on your home screen for quick access.
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={handleInstall}
                size="sm"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Install App
              </Button>
              <Button 
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                Not Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}