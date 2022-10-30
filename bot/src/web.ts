import * as http from "http";
import express, {Application, Request, Response} from "express";
import {apiEventsRouteHandler} from "./web/ApiEventsRoute";
import {configSecrets} from "./utils/ConfigurationSecrets";

export class AirhornWeb {

  public readonly expressApplication: Application;
  public readonly httpServer: http.Server;

  constructor() {
    this.expressApplication = express();
    this.expressApplication.disable("x-powered-by");
    this.httpServer = new http.Server(this.expressApplication);
    // Register the routes
    this.expressApplication.get("/api/events", apiEventsRouteHandler);
    if (configSecrets.web.hostStatic) {
      // Serve the static files for the site if enabled
      this.expressApplication.use(express.static(configSecrets.web.staticDirectory));
    }
    // Send a 404 when the path is not found.
    this.expressApplication.use(((req: Request, res: Response) => {
      res.status(404).header("content-type", "text/plain").send("404: Not Found");
    }));
  }

  async start(): Promise<void> {
    this.httpServer.listen(configSecrets.web.port, () => {
      console.log("Web server is now listening on " + configSecrets.web.port);
    });
  }
}

(async () => {
  const airhornWeb = new AirhornWeb();
  try {
    await airhornWeb.start();
  } catch (e) {
    console.error(e);
  }
})();
