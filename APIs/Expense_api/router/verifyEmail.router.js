import express from "express";
import { verifyEmail_register } from "../controller/verifyEmail.controller.js";

const verifyEmail_router = express.Router();

verifyEmail_router.get("/:token", verifyEmail_register);

export default verifyEmail_router;