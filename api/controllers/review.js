import mongoose from "mongoose";
import Review from "../models/Review.js";
import { createError } from "../utilities/errorStack.js";

export const createNewReview = async (req, res, next) => {
    const {
        user,
        villa,
        rating,
        comments
    } = req.body;

    if(!user || !villa || !rating || !comments){
        return next(createError(400, "Please fill in all of the required fields!"));
    } 

    if(!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(villa)){
        return next(createError(400, "Invalid user or villa id inserted!"));
    } 

    if(req.user.isAdmin){
        return next(createError(400, "Only customers could create reviews on specified villas!"));
    }

    try {
        let isCustReviewed = await Review.findOne({ user, villa });
        if(isCustReviewed){
            return next(createError(400, "You have already reviewed this villa! You may create changes in your previous response."));
        } else {
            const review = new Review({ user, villa, rating, comments, dateCreated: new Date() });
            const savedReview = await review.save();
            res.status(201).json(savedReview);
        }
    } catch(error){
        next(error);
    }
} 

export const getVillaReviews = async (req, res, next) => {
    const villaId = req.params.villaid;
    if(!villaId){
        return next(createError(400, "Unable to track the specified villa be designated ID!"));
    }

    try {
        const villaReviews = await Review.find({
            villa: villaId
        }).populate('user', 'firstName lastName').populate('villa', 'name');
        res.status(201).json(villaReviews);
    } catch(error){
        next(error);
    }
}

export const getReviewDetail = async (req, res, next) => {
    try {
        const reviewId = req.params.reviewid;
        const review = await Review.findById(reviewId).populate('user', 'firstName lastName');

        if(!review){
            return next(createError(400, "Unable to find the specified review!"));
        }

        if(req.user.isAdmin){
            return next(createError(400, "Sorry, only customer can get their review details!"));
        }

        res.status(200).json(review);
    } catch(error){
        next(error);
    }
}

export const updatePrevReview = async (req, res, next) => {
    try {
        const reviewId = req.params.reviewid;

        if(req.user.isAdmin){
            return next(createError(400, "Sorry, only customer can update their reviews!"));
        }

        const review = await Review.findById(reviewId);
        if(!review){
            return next(createError(400, "Unable to track the specified review by its ID!"));
        }

        if(review.user.toString() !== req.user.id.toString()){
            return next(createError(400, "This review does not belong to the current logged in user!"));
        }

        const revisedReview = await Review.findByIdAndUpdate(
            reviewId,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(revisedReview);
    } catch(error){
        next(error);
    }
}