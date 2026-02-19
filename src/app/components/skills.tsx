import { Badge } from "~/components/ui/badge";
import { SKILLS } from "~/constants";

export function Skills() {
  return (
    <section className="py-16">
      <h2 className="text-lg font-semibold tracking-tight">
        Skills & Technologies
      </h2>
      <div className="mt-6 flex flex-wrap gap-2">
        {SKILLS.map((skill) => (
          <Badge key={skill} variant="secondary">
            {skill}
          </Badge>
        ))}
      </div>
    </section>
  );
}
