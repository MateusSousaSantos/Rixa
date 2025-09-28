import React, { useState } from "react";
import { FiShare2, FiCopy, FiCheck } from "react-icons/fi";
import {
  sharePost,
  copyPostUrlToClipboard,
  openSocialShare,
  generateSocialShareUrls,
  type ShareOptions,
} from "../../utils/shareUtils";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";

interface ShareMenuProps {
  options: ShareOptions;
  onClose?: () => void;
}

export const ShareMenu: React.FC<ShareMenuProps> = ({ options, onClose }) => {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "copied">(
    "idle"
  );

  const handleNativeShare = async () => {
    const result = await sharePost(options);

    if (result === "copied") {
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }

    if (onClose) onClose();
  };

  const handleCopyLink = async () => {
    setCopyStatus("copying");
    const success = await copyPostUrlToClipboard(options.postId);

    setCopyStatus(success ? "copied" : "idle");
    setTimeout(() => setCopyStatus("idle"), 2000);
  };

  const handleSocialShare = (
    platform: keyof ReturnType<typeof generateSocialShareUrls>
  ) => {
    openSocialShare(platform, options);
    if (onClose) onClose();
  };



  return (
    <div className="absolute right-0 top-full mt-2 bg-rixa-dark border border-rixa-blue/20 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
      {/* Native Share (if available) */}
      {"share" in navigator && (
        <>
          <button
            onClick={handleNativeShare}
            className="w-full px-4 py-2 text-left text-rixa-cream hover:bg-rixa-blue/10 transition-colors flex items-center gap-3"
          >
            <FiShare2 size={16} />
            <span>Compartilhar</span>
          </button>
          <div className="h-px bg-rixa-blue/20 my-1" />
        </>
      )}

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        disabled={copyStatus === "copying"}
        className="w-full px-4 py-2 text-left text-rixa-cream hover:bg-rixa-blue/10 transition-colors flex items-center gap-3 disabled:opacity-50"
      >
        {copyStatus === "copied" ? (
          <FiCheck size={16} className="text-green-400" />
        ) : (
          <FiCopy size={16} />
        )}
        <span>{copyStatus === "copied" ? "Link copiado!" : "Copiar link"}</span>
      </button>

      <div className="h-px bg-rixa-blue/20 my-1" />

      {/* Social Media Platforms */}
      <button
        onClick={() => handleSocialShare("twitter")}
        className="w-full px-4 py-2 text-left text-rixa-cream hover:bg-rixa-blue/10 transition-colors flex items-center gap-3"
      >
        <FaTwitter size={26} className="text-blue-400" />
        <span>Compartilhar no Twitter</span>
      </button>
      <button
        onClick={() => handleSocialShare("facebook")}
        className="w-full px-4 py-2 text-left text-rixa-cream hover:bg-rixa-blue/10 transition-colors flex items-center gap-3"
      >
        <FaFacebook size={26} className="text-blue-600" />
        <span>Compartilhar no Facebook</span>
      </button>
      <button
        onClick={() => handleSocialShare("whatsapp")}
        className="w-full px-4 py-2 text-left text-rixa-cream hover:bg-rixa-blue/10 transition-colors flex items-center gap-3"
      >
        <FaWhatsapp size={26} className="text-green-500" />
        <span>Compartilhar no WhatsApp</span>
      </button>
    </div>
  );
};

interface ShareButtonProps {
  options: ShareOptions;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  options,
  className = "",
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-blue transition-colors ${className}`}
      >
        <FiShare2 size={16} />
        <span>Compartilhar</span>
      </button>

      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Share Menu */}
          <ShareMenu options={options} onClose={() => setIsMenuOpen(false)} />
        </>
      )}
    </div>
  );
};
