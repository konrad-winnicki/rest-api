import dotenv from "dotenv";
import { app } from "./app";
dotenv.config();

const PORT = process.env.PORT || 4002;

export const server = app.listen(PORT, () => {
  console.log(`App listen at port: ${PORT}`);
});

