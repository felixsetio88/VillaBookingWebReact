import express from "express";
import {
    createNewReview,
    getReviewDetail,
    getVillaReviews,
    updatePrevReview
} from "../controllers/review.js";
import { 
    verifyAdmin,
    verifyUser, 
} from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyUser, createNewReview);
router.get("/:villaid/reviews", getVillaReviews);
router.get("/:reviewid", verifyUser, getReviewDetail);
router.put("/:reviewid", verifyUser, updatePrevReview);

export default router;