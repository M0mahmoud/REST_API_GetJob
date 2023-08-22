import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ msg: "User Route....." });
});

export default router;
