import {readFileSync} from "fs";

interface Configuration {
  
  settings: {
    maxQueueSize: number;
  }

  sounds: {
    [key: string]: {
      name: string;
      description: string;
      emoji: string | undefined;
      variants: {
        [key: string]: string;
      };
    };
  };
}

interface ConfigurationSecrets {

  discord: {
    applicationId: string;
    botId: string;
    token: string;
    emojis: {
      airhorn: string;
    };
  };

  web: {
    port: number;
    hostStatic: boolean;
    staticDirectory: string;
  };

  redis: {
    host: string;
    port: number;
    password: string;
    prefix: string;
  };
}

export const config: Configuration = JSON.parse(readFileSync("./config.json").toString());
export const config: ConfigurationSecrets = JSON.parse(readFileSync("./config_secrets.json").toString());
