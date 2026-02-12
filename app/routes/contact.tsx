import { Form, useActionData, useNavigation } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { z } from "zod/v4";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import type { Route } from "./+types/contact";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function meta() {
  return [
    { title: "Contact — Ihor Mukovoz" },
    {
      name: "description",
      content: "Get in touch with Ihor Mukovoz.",
    },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  // Honeypot check
  const honeypot = formData.get("website");
  if (honeypot) {
    // Bot detected — silently succeed
    return { success: true };
  }

  // CSRF timestamp check (reject if form submitted in under 2 seconds)
  const timestamp = Number(formData.get("_timestamp"));
  if (Date.now() - timestamp < 2000) {
    return { success: true };
  }

  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    message: formData.get("message") as string,
  };

  const result = contactSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  // TODO: Send to email/messenger service
  // For now, just log the submission
  console.log("Contact form submission:", result.data);

  return { success: true };
}

export default function Contact() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

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
          <Form method="post" className="mt-10 space-y-6">
            {/* Honeypot — hidden from real users */}
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <input type="hidden" name="_timestamp" value={Date.now()} />

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                required
                minLength={2}
              />
              {actionData?.errors?.name && (
                <p className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {actionData.errors.name[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
              />
              {actionData?.errors?.email && (
                <p className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {actionData.errors.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell me about your project..."
                rows={5}
                required
                minLength={10}
              />
              {actionData?.errors?.message && (
                <p className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {actionData.errors.message[0]}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  Send message
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </Form>
        )}
      </section>
    </div>
  );
}
