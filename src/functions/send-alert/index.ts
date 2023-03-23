// import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler_stream.main`,
  events: [
    {
      http: {
        method: "post",
        path: "send-alert",
      },
    },
    {
      schedule: "rate(10 minutes)", //"cron(0 12 * * ? *)",
    },
  ],
};
