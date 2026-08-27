import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { siteSettings } from '@/lib/data/content';

export default function AboutPage() {
  return (
    <Section>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <SectionHeading
            title="About"
            description="Context, principles, and the long-term direction behind the studio."
            align="left"
          />
          <div className="mt-6 space-y-5 text-sm leading-relaxed text-text-secondary md:text-base">
            <p>
              {siteSettings.studioName} is a small studio focused on intelligent digital products, AI systems,
              automation, and creative technology. It exists to build things that are structurally sound, visually
              coherent, and intentionally designed.
            </p>
            <p>
              The studio treats product quality as a function of craft: clarity in thinking, discipline in
              execution, and long-term ownership of what is built. That means preferring durable architecture,
              readable systems, and interfaces that feel designed rather than assembled.
            </p>
            <p>
              Future phases will introduce deeper interactive experiences, agent tooling, voice interfaces, and
              project-level showcases. This foundation intentionally keeps those capabilities separate until the
              core system is stable and genuinely verified.
            </p>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold text-text-primary">Principles</h3>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>1. Prefer durable systems over quick wins.</li>
              <li>2. Keep human approval at the center of automation.</li>
              <li>3. Make design tokens and content data-driven.</li>
              <li>4. Separate admin capabilities from public interfaces.</li>
              <li>5. Verify behavior before claiming completion.</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
