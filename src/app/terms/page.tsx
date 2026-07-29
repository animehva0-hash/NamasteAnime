import { FileText } from "lucide-react";

const sections = [
  {
    title: "1. Terms",
    content: `By accessing this Website, accessible from /, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.`,
  },
  {
    title: "2. Use License",
    content: `Permission is granted to temporarily download one copy of the materials on Namaste Anime's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:`,
    list: [
      "modify or copy the materials;",
      "use the materials for any commercial purpose or for any public display;",
      "attempt to reverse engineer any software contained on Namaste Anime's Website;",
      "remove any copyright or other proprietary notations from the materials; or",
      "transferring the materials to another person or \"mirror\" the materials on any other server.",
    ],
    after: `This will let Namaste Anime to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format.`,
  },
  {
    title: "3. Disclaimer",
    content: `All the materials on Namaste Anime's Website are provided "as is". Namaste Anime makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Namaste Anime does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.`,
  },
  {
    title: "4. Limitations",
    content: `Namaste Anime or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Namaste Anime's Website, even if Namaste Anime or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.`,
  },
  {
    title: "5. Revisions and Errata",
    content: `The materials appearing on Namaste Anime's Website may include technical, typographical, or photographic errors. Namaste Anime will not promise that any of the materials in this Website are accurate, complete, or current. Namaste Anime may change the materials contained on its Website at any time without notice. Namaste Anime does not make any commitment to update the materials.`,
  },
  {
    title: "6. Links",
    content: `Namaste Anime has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by Namaste Anime of the site. The use of any linked website is at the user's own risk.`,
  },
  {
    title: "7. Site Terms of Use Modifications",
    content: `Namaste Anime may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.`,
  },
  {
    title: "8. Your Privacy",
    content: `Please read our Privacy Policy.`,
  },
  {
    title: "9. Governing Law",
    content: `Any claim related to Namaste Anime's Website shall be governed by the laws of the applicable jurisdiction without regards to its conflict of law provisions.`,
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-highlight/15 flex items-center justify-center">
          <FileText size={24} className="text-highlight" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Terms of Use</h1>
          <p className="text-text-muted text-sm">Anime Website Terms and Conditions</p>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((s, i) => (
          <div key={i} className="p-4 sm:p-5 rounded-xl bg-card border border-border/20">
            <h2 className="text-base sm:text-lg font-bold text-white mb-3">{s.title}</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{s.content}</p>
            {s.list && (
              <ul className="mt-3 space-y-1.5 ml-4">
                {s.list.map((item, j) => (
                  <li key={j} className="text-sm text-text-secondary list-disc">{item}</li>
                ))}
              </ul>
            )}
            {s.after && (
              <p className="text-sm text-text-secondary leading-relaxed mt-3">{s.after}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
