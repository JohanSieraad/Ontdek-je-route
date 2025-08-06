import { Button } from "@/components/ui/button";
import { Share2, Facebook, Twitter, Instagram, MessageCircle } from "lucide-react";
import { SiFacebook, SiX, SiInstagram, SiWhatsapp, SiTelegram } from "react-icons/si";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  variant?: "default" | "minimal" | "compact";
  className?: string;
}

export function SocialShare({ 
  url, 
  title, 
  description = "", 
  variant = "default",
  className = ""
}: SocialShareProps) {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const shareUrl = window.location.origin + url;
  const shareText = `${title} - ${description}`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    instagram: `https://www.instagram.com/` // Instagram doesn't support direct URL sharing
  };

  const handleShare = async (platform: keyof typeof shareLinks) => {
    setIsSharing(true);
    
    if (platform === 'instagram') {
      toast({
        title: "Instagram tip",
        description: "Kopieer de link en deel in je Instagram story of post!",
      });
      
      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link gekopieerd",
          description: "De link is gekopieerd naar je klembord.",
        });
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
    
    setTimeout(() => setIsSharing(false), 1000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link gekopieerd",
          description: "De link is gekopieerd naar je klembord.",
        });
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  if (variant === "minimal") {
    return (
      <div className={`flex items-center gap-2 ${className}`} data-testid="social-share-minimal">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNativeShare}
          className="flex items-center gap-2"
          data-testid="button-share-native"
        >
          <Share2 className="h-4 w-4" />
          Delen
        </Button>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-1 ${className}`} data-testid="social-share-compact">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleShare('facebook')}
          disabled={isSharing}
          data-testid="button-share-facebook-compact"
        >
          <SiFacebook className="h-4 w-4 text-blue-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleShare('twitter')}
          disabled={isSharing}
          data-testid="button-share-twitter-compact"
        >
          <SiX className="h-4 w-4 text-blue-400" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleShare('whatsapp')}
          disabled={isSharing}
          data-testid="button-share-whatsapp-compact"
        >
          <SiWhatsapp className="h-4 w-4 text-green-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNativeShare}
          data-testid="button-share-more-compact"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`} data-testid="social-share-default">
      <div className="flex items-center gap-2 mb-2">
        <Share2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Deel deze route</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('facebook')}
          disabled={isSharing}
          className="flex items-center gap-2 justify-start"
          data-testid="button-share-facebook"
        >
          <SiFacebook className="h-4 w-4 text-blue-600" />
          Facebook
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('twitter')}
          disabled={isSharing}
          className="flex items-center gap-2 justify-start"
          data-testid="button-share-twitter"
        >
          <SiX className="h-4 w-4 text-blue-400" />
          X (Twitter)
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('whatsapp')}
          disabled={isSharing}
          className="flex items-center gap-2 justify-start"
          data-testid="button-share-whatsapp"
        >
          <SiWhatsapp className="h-4 w-4 text-green-600" />
          WhatsApp
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('telegram')}
          disabled={isSharing}
          className="flex items-center gap-2 justify-start"
          data-testid="button-share-telegram"
        >
          <SiTelegram className="h-4 w-4 text-blue-500" />
          Telegram
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('instagram')}
          disabled={isSharing}
          className="flex items-center gap-2 justify-start"
          data-testid="button-share-instagram"
        >
          <SiInstagram className="h-4 w-4 text-pink-600" />
          Instagram
        </Button>
      </div>
      
      {navigator.share && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNativeShare}
          className="w-full flex items-center gap-2"
          data-testid="button-share-native-full"
        >
          <Share2 className="h-4 w-4" />
          Meer opties...
        </Button>
      )}
    </div>
  );
}