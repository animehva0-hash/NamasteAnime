import Link from "next/link";
import { Shield, AlertTriangle, FileText, Mail } from "lucide-react";

export default function DMCAPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-highlight/15 flex items-center justify-center">
          <Shield size={24} className="text-highlight" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">DMCA</h1>
          <p className="text-text-muted text-sm">Digital Millennium Copyright Act</p>
        </div>
      </div>

      <div className="space-y-6 text-sm sm:text-base text-text-secondary leading-relaxed">
        <p>
          We take the intellectual property rights of others seriously and require that our Users do the same. The Digital Millennium Copyright Act (DMCA) established a process for addressing claims of copyright infringement. If you own a copyright or have authority to act on behalf of a copyright owner and want to report a claim that a third party is infringing that material on or through our services, please submit a DMCA report on our{" "}
          <Link href="/contact" className="text-highlight hover:underline font-medium">Contact page</Link>, and we will take appropriate action.
        </p>

        <div className="p-4 sm:p-6 rounded-xl bg-card border border-border/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-yellow-400" />
            <h2 className="text-lg font-bold text-white">DMCA Report Requirements</h2>
          </div>

          <ul className="space-y-3 list-none">
            {[
              "A description of the copyrighted work that you claim is being infringed;",
              "A description of the material you claim is infringing and that you want removed or access to which you want disabled and the URL or other location of that material;",
              "Your name, title (if acting as an agent), address, telephone number, and email address;",
              "The following statement: \"I have a good faith belief that the use of the copyrighted material I am complaining of is not authorized by the copyright owner, its agent, or the law (e.g., as a fair use)\";",
              "The following statement: \"The information in this notice is accurate and, under penalty of perjury, I am the owner, or authorized to act on behalf of the owner, of the copyright or of an exclusive right that is allegedly infringed\";",
              "An electronic or physical signature of the owner of the copyright or a person authorized to act on the owner's behalf.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <FileText size={16} className="text-highlight flex-shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 sm:p-6 rounded-xl bg-highlight/10 border border-highlight/20">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={18} className="text-highlight" />
            <h3 className="text-base font-bold text-white">Submit Your Request</h3>
          </div>
          <p>
            Your DMCA take down request should be submitted here:{" "}
            <Link href="/contact" className="text-highlight hover:underline font-semibold">Contact Us</Link>
          </p>
          <p className="mt-2 text-text-muted text-sm">
            We will then review your DMCA request and take proper actions, including removal of the content from the website.
          </p>
        </div>
      </div>
    </div>
  );
}
