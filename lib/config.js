function resolveKey(envVal, b64Fallback) {
  if (envVal && envVal.trim()) return envVal.trim();
  return Buffer.from(b64Fallback, "base64").toString("utf8");
}

export const CONFIG = {
  GOOGLE_PLACES_API_KEY: resolveKey(
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_API_KEY,
    "QUl6YVN5Q0Ezb1dPMTdLMzVoRVYwTDNLaXVmY3F3OTRtOGZ6b1hz"
  ),

  GEMINI_API_KEY: resolveKey(
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    "QVEuQWI4Uk42S1k5SnpybWR2N01YOUpvTmw0NDM5SVpRWF80YWtzNDBmdDAtbDZpdEVfaHc="
  ),

  LOOKBOOK_URL: "https://artisanys1.vercel.app/",
  PORTFOLIO_URL: "https://sites.google.com/view/morkech/home",
  AGENCY_NAME: "Marrakech Craft Conduit — Artisan Export Engine",
  FOUNDER: "Hassan Tiguidda",
  CONTACT_PHONE: "+212 6 32 15 54 30",
  CONTACT_EMAIL: "tiguidda76@gmail.com",
};
