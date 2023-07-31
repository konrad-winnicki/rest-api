import path from "path";
import dotenv from "dotenv";
import { Environment } from "./Types/environment";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

interface ENV {
  PORT: string | undefined;
  DATABASE_URI_PROD: string | undefined;
  DATABASE_URI_DEV: string | undefined;
  DATABASE_URI_TEST: string | undefined;
  TOKEN_SIGNATURE: string | undefined;
  SSLKEY: string | undefined;
  SSLCERT: string | undefined;
  NODE_ENV: Environment | undefined;
}

interface Config {
  PORT: string;
  DATABASE_URI_PROD: string;
  DATABASE_URI_DEV: string;
  DATABASE_URI_TEST: string;
  TOKEN_SIGNATURE: string;
  SSLKEY: string;
  SSLCERT: string;
  NODE_ENV: Environment;
}

const getConfiguration = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URI_PROD: process.env.DATABASE_URI_PROD,
    DATABASE_URI_DEV: process.env.DATABASE_URI_DEV,
    DATABASE_URI_TEST: process.env.DATABASE_URI_TEST,
    SSLCERT: process.env.SSLCERT,
    SSLKEY: process.env.SSLKEY,
    TOKEN_SIGNATURE: process.env.TOKEN_SIGNATURE,
  };
};

const getSanitizedConfig = (configuration: ENV): Config => {
  for (const [key, value] of Object.entries(configuration)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }

  return configuration as Config;
};

const config = getConfiguration();
const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;
