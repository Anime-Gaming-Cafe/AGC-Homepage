export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startDiscord } = await import("./lib/discord/cache");
    try {
      await startDiscord();
    } catch (error) {
      console.error("[instrumentation] Discord startup failed:", error);
    }
  }
}
