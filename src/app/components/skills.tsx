import { SectionHeading } from "~/components/section-heading";
import { SKILL_ICONS } from "~/components/skill-icons";
import { SpotlightCard } from "~/components/spotlight-card";
import { SKILLS } from "~/constants";

export function Skills() {
  return (
    <section className="py-16 container mx-auto px-4">
      <SectionHeading>Technologies & Tools</SectionHeading>

      <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {SKILLS.map((skill) => {
          const Icon = SKILL_ICONS[skill.icon as keyof typeof SKILL_ICONS];

          return (
            <SpotlightCard
              key={skill.name}
              className="relative overflow-hidden p-6 aspect-square flex items-center"
              spotlightColor={skill.spotlightColor}
            >
              {Icon && (
                <Icon className="absolute -bottom-4 -right-4 size-2/4 text-muted-foreground/50 opacity-15" />
              )}

              <div className="relative z-10 space-y-2 overflow-hidden">
                <h3 className="font-semibold text-2xl truncate">
                  {skill.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {skill.description}
                </p>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
}
