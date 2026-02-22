import {
  Body,
  Column,
  Head,
  Heading,
  Html,
  Row,
  render,
  Section,
  toPlainText,
} from "@react-email/components";
import { env } from "~/env.server";
import { sendEmail } from "~/lib/mail";

export interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
  ip?: string | null;
  userAgent?: string | null;
}

export function ContactEmail(props: ContactEmailProps) {
  const { name, email, message, ip, userAgent } = props;

  return (
    <Html lang="en">
      <Head />

      <Body>
        <Section>
          <Heading>New Contact Form Submission</Heading>
        </Section>
        <Section>
          <Row>
            <Column>Name:</Column>
            <Column>{name}</Column>
          </Row>
          <Row>
            <Column>Email:</Column>
            <Column>{email}</Column>
          </Row>
          <Row>
            <Column>Message:</Column>
            <Column>{message}</Column>
          </Row>
          {ip && (
            <Row>
              <Column>IP Address:</Column>
              <Column>{ip}</Column>
            </Row>
          )}
          {userAgent && (
            <Row>
              <Column>User Agent:</Column>
              <Column>{userAgent}</Column>
            </Row>
          )}
        </Section>
      </Body>
    </Html>
  );
}

export async function sendContactEmail(options: ContactEmailProps) {
  const html = await render(<ContactEmail {...options} />);
  const text = toPlainText(html);

  await sendEmail({
    to: env.SEND_CONTACT_TO,
    subject: "New Contact Form Submission",
    html,
    text,
  });
}
