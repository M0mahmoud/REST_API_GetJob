import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ msg: "Company Route....." });
});

export default router;
