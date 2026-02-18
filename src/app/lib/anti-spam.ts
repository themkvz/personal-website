/**
 * Checks for honeypot field and CSRF timestamp to detect bot submissions.
 * Returns true if the submission looks like spam.
 */
export async function isSpam(request: Request): Promise<boolean> {
  const formData = await request.clone().formData();

  // Honeypot: bots tend to fill hidden fields
  if (formData.get("website")) {
    return true;
  }

  // CSRF timestamp: reject if form submitted in under 2 seconds
  const timestamp = Number(formData.get("_timestamp"));
  if (Date.now() - timestamp < 2000) {
    return true;
  }

  return false;
}
