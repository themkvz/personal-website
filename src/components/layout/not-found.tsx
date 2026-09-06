import { Button } from "~/components/atoms/button";
import { Link } from "~/components/atoms/link";
import { Overline } from "~/components/atoms/overline";
import { Container } from "~/components/layout/container";
import { Section } from "~/components/layout/section";
import { NotFound as NotFoundCopy } from "~/constants";
import { TRACK_EVENTS } from "~/lib/openpanel/events";
import { useTrack } from "~/lib/openpanel/useOpenPanel";

/* The error numeral is page art rather than running text, so it sits outside
   the type scale; JetBrains Mono supplies the dotted zero the design uses. */
const DIGIT =
  "font-display text-[120px] leading-none font-bold tracking-[-7px] sm:text-[250px] sm:tracking-[-14px]";

export function NotFound() {
  const track = useTrack();

  return (
    <Section>
      <Container className="min-h-[60svh] flex flex-col gap-24 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4">
          <Overline>{NotFoundCopy.overline}</Overline>
          <p aria-hidden="true" className="flex items-center">
            <span className={`${DIGIT} text-foreground`}>4</span>
            <span className={`${DIGIT} text-building`}>0</span>
            <span className={`${DIGIT} text-foreground`}>4</span>
          </p>
        </div>

        <div className="flex max-w-[620px] flex-col gap-6">
          <Overline>{NotFoundCopy.status}</Overline>
          <h1 className="t-display-md whitespace-pre-line">
            {NotFoundCopy.title}
          </h1>
          <p className="t-body text-muted-foreground">
            {NotFoundCopy.explanation}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              to="/"
              onClick={() => track(TRACK_EVENTS.NOT_FOUND_CLICKED_BACK)}
            >
              {NotFoundCopy.returnCta}
            </Button>
            <Link to="/workbench" tone="accent">
              {NotFoundCopy.workbenchCta}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
