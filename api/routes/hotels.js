import express from "express";
import {
  countByCity,
  countByType,
  createHotel,
  createHotelWithPhoto,
  deleteHotel,
  getHotel,
  getHotelRooms,
  getHotels,
  getMostViewed,
  getRecentlyAdded,
  updateHotel,
  updateHotelWithPhoto,
  updateSold,
  updateViews
} from "../controllers/hotel.js";
import Hotel from "../models/Hotel.js";

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js"
const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createHotel);
router.post("/createWithPhoto", verifyAdmin, createHotelWithPhoto);
router.put("/updateWithPhoto/:id", verifyAdmin, updateHotelWithPhoto);

//UPDATE
router.put("/:id", verifyAdmin, updateHotel);

//DELETE
router.delete("/:id", verifyAdmin, deleteHotel);

//GET
router.get("/find/:id", getHotel);
//GET ALL

router.get("/", getHotels);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);

router.put("/update-sold/:id", verifyUser, updateSold)
router.put("/update-view/:id", updateViews)
router.get('/most-viewed/', getMostViewed);
router.get("/recently-added/", getRecentlyAdded);

export default router;
