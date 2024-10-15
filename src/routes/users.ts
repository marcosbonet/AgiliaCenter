import { Router } from "express";
import { verifyToken } from "../middleware/auth";
import UserControllers from "../controllers/user.controllers";

const { register, signin, profile, unsubscribe } = UserControllers;
const router = Router();

router.post("/register", register);
router.post("/signin", signin);
router.get("/profile", verifyToken, profile);
router.post("/unsubscribe", verifyToken, unsubscribe);

export default router;
