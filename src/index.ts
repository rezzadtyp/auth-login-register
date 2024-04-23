import app from "./app";
import { appConfig } from "./utils/config";

const PORT = appConfig.port;

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
