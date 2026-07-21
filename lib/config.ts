const REQUIRED_VARS = [
  "DISCORD_TOKEN",
  "DISCORD_GUILD_ID",
  "DISCORD_STAFF_ROLE_ID",
  "DATABASE_HOST",
  "DATABASE_USER",
  "DATABASE_PASSWORD",
  "DATABASE_NAME",
] as const;

const AUTH_VARS = ["AUTH_SECRET", "AUTH_DISCORD_ID", "AUTH_DISCORD_SECRET"];

type RequiredVar = (typeof REQUIRED_VARS)[number];

export function getEnv(name: RequiredVar): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function validateConfig(): void {
  const missing = REQUIRED_VARS.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
  const missingAuth = AUTH_VARS.filter((name) => !process.env[name]);
  if (missingAuth.length > 0) {
    console.warn(
      `[config] Missing auth variables (team login disabled): ${missingAuth.join(", ")}`
    );
  }
}
