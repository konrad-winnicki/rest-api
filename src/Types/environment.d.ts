export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_URI_PROD: string
      DATABASE_URI_DEV: string
      DATABASE_URI_TEST: string
      TOKEN_SIGNATURE: string;
      SSLKEY: string;
      SSLCERT: string;
      NODE_ENV: string;
    }
  }
}