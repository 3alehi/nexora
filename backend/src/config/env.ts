import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",

  supabaseUrl: required("SUPABASE_URL"),
  supabaseAnonKey: required("SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),

  coingeckoApiKey: process.env.COINGECKO_API_KEY ?? "",
  coingeckoApiUrl: process.env.COINGECKO_API_URL ?? "https://api.coingecko.com/api/v3",

  zerionApiKey: process.env.ZERION_API_KEY ?? "",

  network: process.env.NETWORK ?? "sepolia",

  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
};
