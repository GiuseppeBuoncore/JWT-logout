import "dotenv/config";
require("dotenv").config();
import { Request, Response } from "express";
import { db } from "./../db.js";
import jwt from "jsonwebtoken";

const logIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await db.one(`SELECT * FROM users WHERE username=$1`, username);

  if (user && user.password === password) {
    const payload = {
      id: user.id,
      username,
    };
    const { SECRET_KEY = "" } = process.env;
    const token = jwt.sign(payload, SECRET_KEY);

    console.log(token);

    await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user.id, token]);
    res.status(200).json({ id: user.id, username, token });
  } else {
    res.status(400).json({ msg: "username or password incorrect." });
  }
};

const signUp = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = db.oneOrNone(`SELECT * FROM users WHERE username=$1`, username);

  if (await user) {
    res.status(409).json({ msg: "username already in use" });
  } else {
    const { id } = await db.one(
      `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`,
      [username, password]
    );

    res.status(201).json({ id, msg: "Signup successful. Now you can log in." });
  }
};

const logout = async (req: Request, res: Response) => {
  const user: any = req.user;
  await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user?.id, null]);
  res.status(200).json({ msg: "Logout successfully" });
};

export { logIn, signUp, logout };
