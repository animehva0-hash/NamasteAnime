import Link from "next/link";
import { Flame, Shield, Mail, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/20 bg-surface mt-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-highlight to-red-400 flex items-center justify-center">
              <Flame size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">Namaste Anime</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/terms" className="flex items-center gap-1.5 text-sm text-text-muted hover:text-highlight transition-colors">
              <FileText size={14} /> Terms of Use
            </Link>
            <Link href="/dmca" className="flex items-center gap-1.5 text-sm text-text-muted hover:text-highlight transition-colors">
              <Shield size={14} /> DMCA
            </Link>
            <Link href="/contact" className="flex items-center gap-1.5 text-sm text-text-muted hover:text-highlight transition-colors">
              <Mail size={14} /> Contact
            </Link>
          </div>
          <p className="text-xs text-text-muted text-center">© 2026 Namaste Anime</p>
        </div>
      </div>
    </footer>
  );
}
