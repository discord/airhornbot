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

export const config: Configuration = JSON.parse(readFileSync("./config.json").toString());
