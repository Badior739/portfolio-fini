import { createServer } from "./index";

const app = createServer();
const port = Number(process.env.PORT) || 8080;
const host = "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
