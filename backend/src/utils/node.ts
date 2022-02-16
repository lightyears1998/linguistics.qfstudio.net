export function isDevelopmentEnvironment(): boolean {
  const env = process.env.NODE_ENV;
  return env === "development" || env === "dev";
}
