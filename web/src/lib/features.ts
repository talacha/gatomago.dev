/**
 * Master switch for the newsletter: the sign-up form, every "Join the Circle" link, the privacy
 * page, and sending. Off unless NEWSLETTER_ENABLED is exactly "true". Read at build/render time, so
 * changing it needs a redeploy.
 *
 * Unsubscribe, confirm and erase links keep working even when it is off: anyone who already
 * subscribed must always be able to leave or delete their data.
 */
export const newsletterEnabled = () => process.env.NEWSLETTER_ENABLED === "true";
