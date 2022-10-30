import {readFileSync} from "fs";

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

export const configSecrets: ConfigurationSecrets = JSON.parse(readFileSync("./config_secrets.json").toString());
