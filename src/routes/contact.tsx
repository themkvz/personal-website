import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";
import { useCallback } from "react";
import { Controller } from "react-hook-form";
import { useFetcher } from "react-router";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import type { z } from "zod/v4";
import { sendContactEmail } from "~/components/emails/contact";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { db } from "~/db";
import { contacts } from "~/db/schema";
import { isSpam } from "~/lib/anti-spam";
import { getClientInfo } from "~/lib/client-info";
import { TRACK_EVENTS } from "~/lib/openpanel/events";
import { trackEvent } from "~/lib/openpanel/getOpenPanel";
import { useTrack } from "~/lib/openpanel/useOpenPanel";
import { cn } from "~/lib/utils";
import { contactSchema } from "~/schemas/contact";
import type { Route } from "./+types/contact";

type ContactFormData = z.infer<typeof contactSchema>;

const resolver = zodResolver(contactSchema);

export function meta() {
  return [
    { title: "Contact Ihor M. — Hire a Full-Stack Developer" },
    {
      name: "description",
      content:
        "Ready to build your next project? Get in touch for front-end consulting, full-stack development, or technical leadership inquiries.",
    },
    {
      property: "og:title",
      content: "Contact Ihor M. — Hire a Full-Stack Developer",
    },
    {
      property: "og:description",
      content:
        "Ready to build your next project? Get in touch for front-end consulting, full-stack development, or technical leadership inquiries.",
    },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  if (await isSpam(request)) {
    return { success: true as const };
  }

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<ContactFormData>(request, resolver);

  if (errors) {
    return { success: false as const, errors, defaultValues };
  }

  const { ip, userAgent } = getClientInfo(request);

  const contactData = {
    ...data,
    ip,
    userAgent,
  };
  await db.insert(contacts).values(contactData);
  trackEvent(TRACK_EVENTS.CONTACT_SAVED, contactData);
  sendContactEmail(contactData);

  return { success: true as const };
}

export default function Contact() {
  const fetcher = useFetcher<typeof action>();
  const actionData = fetcher.data;
  const track = useTrack();
  const trackBlurredField = useCallback(
    (fieldName: string, fieldValue: string) => {
      track(TRACK_EVENTS.CONTACT_FIELD_BLURRED, {
        fieldName,
        fieldValue,
      });
    },
    [track],
  );

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    control,
  } = useRemixForm<ContactFormData>({
    mode: "onBlur",
    resolver,
    fetcher,
    defaultValues: {
      name: actionData?.defaultValues?.name || "",
      email: actionData?.defaultValues?.email || "",
      message: actionData?.defaultValues?.message || "",
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-16 sm:py-20">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Contact
        </h1>
        <p className="mt-4 text-muted-foreground">
          Have a project in mind or just want to say hi? Drop me a message and
          I'll get back to you as soon as possible.
        </p>

        {actionData?.success ? (
          <div className="mt-10 flex items-center gap-3 rounded-lg border bg-card p-6">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
            <div>
              <p className="font-medium">Message sent!</p>
              <p className="text-sm text-muted-foreground">
                Thank you for reaching out. I'll get back to you soon.
              </p>
            </div>
          </div>
        ) : (
          <fetcher.Form method="post" className="mt-10" onSubmit={handleSubmit}>
            {/* Honeypot — hidden from real users */}
            <div className="absolute -left-2499.75" aria-hidden="true">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <input type="hidden" name="_timestamp" value={Date.now()} />

            <FieldGroup>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      {...field}
                      onBlur={(e) => {
                        trackBlurredField(field.name, e.currentTarget.value);
                        field.onBlur();
                      }}
                      id={field.name}
                      placeholder="Your name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      onBlur={(e) => {
                        trackBlurredField(field.name, e.currentTarget.value);

                        field.onBlur();
                      }}
                      id={field.name}
                      type="email"
                      placeholder="your@email.com"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="message"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor={field.name}>Message</FieldLabel>
                    <Textarea
                      {...field}
                      onBlur={(e) => {
                        trackBlurredField(field.name, e.currentTarget.value);
                        field.onBlur();
                      }}
                      id={field.name}
                      placeholder="Tell me about your project..."
                      rows={5}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              className={cn(
                "mt-7",
                (isSubmitting || !isValid) && "cursor-not-allowed opacity-50",
              )}
              onClick={() => track(TRACK_EVENTS.SUBMIT_FORM_CLICKED)}
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  Send message
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </fetcher.Form>
        )}
      </section>
    </div>
  );
}
