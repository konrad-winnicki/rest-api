import { app } from "./app";
import sanitizedConfig from "./config";

const PORT = sanitizedConfig.PORT || 4002;

export const server = app.listen(PORT, () => {
  console.log(`App listen at port: ${PORT}`);
});

