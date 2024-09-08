import express from "express";
import {
  countByCity,
  countByType,
  createVilla,
  createVillaWithPhoto,
  deleteVilla,
  getVilla,
  getVillaRooms,
  getVillas,
  getMostViewed,
  getRecentlyAdded,
  updateVilla,
  updateVillaWithPhoto,
  updateSold,
  updateViews
} from "../controllers/villa.js";
import Villa from "../models/Villa.js";

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js"
const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createVilla);
router.post("/createWithPhoto", verifyAdmin, createVillaWithPhoto);
router.put("/updateWithPhoto/:id", verifyAdmin, updateVillaWithPhoto);

//UPDATE
router.put("/:id", verifyAdmin, updateVilla);

//DELETE
router.delete("/:id", verifyAdmin, deleteVilla);

//GET
router.get("/find/:id", getVilla);
//GET ALL

router.get("/", getVillas);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getVillaRooms);

router.put("/update-sold/:id", verifyUser, updateSold)
router.put("/update-view/:id", updateViews)
router.get('/most-viewed/', getMostViewed);
router.get("/recently-added/", getRecentlyAdded);

export default router;
