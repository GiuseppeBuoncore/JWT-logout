import express from "express";
import morgan from "morgan";
import "express-async-errors";
import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
  createImage,
} from "./controllers/planets.js";

import { logIn, signUp, logout } from "./controllers/users";

import authorize from "./authorize.js";

import multer from "multer";

import "./passport.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const app = express();
const port = 3000;

app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/planets", getAll);

app.get("/api/planets/:id", getOneById);

app.post("/api/planets", create);

app.put("/api/planets/:id", updateById);

app.delete("/api/planets/:id", deleteById);

app.post("/api/planets/:id/image", upload.single("image"), createImage);

app.post("/api/users/login", logIn);

app.post("/api/users/signup", signUp);

app.get("/api/users/logout", authorize, logout);

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
