import { SiTelegram } from "@icons-pack/react-simple-icons";
import { useHover } from "@uidotdev/usehooks";
import { GlobeIcon, MailIcon, User2Icon } from "lucide-react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { DecryptedText } from "./decrypted-text";

const BUTTONS = [
  { key: "user", icon: User2Icon },
  { key: "site", icon: GlobeIcon },
  { key: "mail", icon: MailIcon },
  { key: "tg", icon: SiTelegram },
] as const;

const HOVER_ORDER = ["mail", "user", "site", "tg"] as const;

const LABELS: Record<(typeof HOVER_ORDER)[number], string> = {
  mail: "Email",
  user: "Name",
  site: "Website",
  tg: "Telegram",
};

export function IdentityCard() {
  const [userRef, userHovering] = useHover();
  const [siteRef, siteHovering] = useHover();
  const [mailRef, mailHovering] = useHover();
  const [tgRef, tgHovering] = useHover();

  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const atRef = useRef<HTMLSpanElement>(null);
  const nickRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  const [segments, setSegments] = useState({
    name: { x: 0, w: 0 },
    at: { x: 0, w: 0 },
    nick: { x: 0, w: 0 },
    dot: { x: 0, w: 0 },
  });

  const [lastHighlight, setLastHighlight] = useState({ x: 0, w: 0 });

  const hoverState = {
    user: userHovering,
    site: siteHovering,
    mail: mailHovering,
    tg: tgHovering,
  } as const;

  const activeKey = useMemo(() => {
    const matchKey = HOVER_ORDER.find((key) => hoverState[key]);
    return matchKey ?? null;
  }, [hoverState]);

  const hovering = activeKey !== null;

  const showName = activeKey === "mail" || activeKey === "user";
  const showNick =
    activeKey === "mail" || activeKey === "site" || activeKey === "tg";
  const showAt = activeKey === "mail" || activeKey === "tg";
  const showDotCom = activeKey === "mail" || activeKey === "site";

  const label = activeKey ? LABELS[activeKey] : "";

  const segmentClass = (isActive: boolean) =>
    cn(
      "transition-[color,opacity] duration-300",
      hovering
        ? isActive
          ? "text-primary opacity-100"
          : "opacity-40"
        : "opacity-100",
    );

  const measure = useCallback(() => {
    if (!containerRef.current) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const readRect = (ref: React.RefObject<HTMLSpanElement | null>) => {
      const rect = ref.current?.getBoundingClientRect();

      if (!rect) {
        return { x: 0, w: 0 };
      }

      return {
        x: rect.left - containerRect.left,
        w: rect.width,
      };
    };

    setSegments({
      name: readRect(nameRef),
      at: readRect(atRef),
      nick: readRect(nickRef),
      dot: readRect(dotRef),
    });
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useLayoutEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const observer = new ResizeObserver(() => {
      measure();
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [measure]);

  const targetHighlight = useMemo(() => {
    if (activeKey === "mail") {
      return {
        x: segments.name.x,
        w: segments.name.w + segments.at.w + segments.nick.w + segments.dot.w,
      };
    }

    if (activeKey === "user") {
      return segments.name;
    }

    if (activeKey === "site") {
      return {
        x: segments.nick.x,
        w: segments.nick.w + segments.dot.w,
      };
    }

    if (activeKey === "tg") {
      return {
        x: segments.at.x,
        w: segments.at.w + segments.nick.w,
      };
    }

    return { x: 0, w: 0 };
  }, [activeKey, segments]);

  const highlight = hovering ? targetHighlight : lastHighlight;

  useLayoutEffect(() => {
    if (!hovering) {
      return;
    }

    setLastHighlight(targetHighlight);
  }, [hovering, targetHighlight]);

  return (
    <section className="py-16 container mx-auto px-4 font-mono">
      <div className="text-center text-2xl sm:text-4xl">
        <div className="flex justify-center mt-6 mb-10">
          <div ref={containerRef} className="relative inline-flex items-end">
            <span ref={nameRef} className={segmentClass(showName)}>
              ihor
            </span>
            <span ref={atRef} className={segmentClass(showAt)}>
              @
            </span>
            <span ref={nickRef} className={segmentClass(showNick)}>
              themkvz
            </span>
            <span ref={dotRef} className={segmentClass(showDotCom)}>
              .com
            </span>
            <span
              className={cn(
                "absolute left-0 top-full h-8 border-b-2 border-l-2 border-r-2 border-transparent border-dashed rounded-b opacity-0 transition-[transform,width,opacity,border-color] duration-300",
                hovering && "opacity-100 border-foreground/20",
              )}
              style={{
                width: `${Math.max(highlight.w, 0)}px`,
                transform: `translateX(${highlight.x}px) translateY(${hovering ? "4px" : "-24px"})`,
              }}
            >
              <span
                className={cn(
                  "text-sm leading-none text-foreground relative bottom-1 md:bottom-3 opacity-0 transition-opacity",
                  hovering && "opacity-100",
                )}
              >
                <DecryptedText text={label} animateOn="view" />
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        {BUTTONS.map(({ key, icon: Icon }) => {
          const refMap = {
            user: userRef,
            site: siteRef,
            mail: mailRef,
            tg: tgRef,
          } as const;

          return (
            <div key={key} ref={refMap[key]} className="p-2">
              <Button variant={"secondary"} size={"icon"}>
                <Icon className="size-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
