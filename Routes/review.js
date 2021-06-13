const express = require("express");
const Router = express.Router();
const auth = require("../Auth/auth");
const Course = require("../Model/course");
const Video = require("../Model/video");
const Tutor = require("../Model/tutor");
const Student = require("../Model/student");
const Review = require("../Model/review");


Router.post("/addreview/:courseId", auth, async(req, res) => {
    try {
        
        const course = await Course.findById({_id: req.params.courseId});
        const student = await Student.findById({_id: req.user.id});
        const newReview = new Review({
            ...req.body
        });

        newReview.reviewerId = req.user.id;
        newReview.courseId = req.params.courseId;

        await newReview.save();

        course.reviews.push(newReview._id);
        student.yourReviews.push(newReview._id);

        await course.save();
        await student.save();

        res.status(200).send({message: "Review posted successfully", newReview});

    } catch (error) {
        console.log("Review not posted", error);
        res.status(500).send({message: "Error while posting review", error: error.message});
    };
});

Router.get("/allreviews/:courseId", async (req, res) => {
    try {
        const reviews = await Review.find({courseId: req.params.courseId});
        
        res.status(200).send({message: "All reviews of this course fetched", reviews});

    } catch (error) {
        console.log("Error: Couldn't fetch reviews", error);
        res.status(500).send({
            message: "Error while fetching reviews", error: error.message
    });
}});

Router.patch("/editreview/:reviewId", auth, async (req, res) => {
    try {

        const updatedReview = await Review.findOneAndUpdate(
            {_id: req.params.reviewId},
            {
                $set: {
                    ...req.body
                }
            }
        );

        res.status(200).send({message: "Review updated", updatedReview: req.body});
        
    } catch (error) {
        console.log("Error: Couldn't update the Review", error);
        res.status(500).send({ message: "Error while updating review", error: error.message });
    };
});

Router.delete("/deletereview/:reviewId", auth, async (req, res) => {
    try {

        const review = await Review.findOneAndDelete({_id:req.params.reviewId});
        res.status(200).send({message: "Review deleted successfully"});

        
    } catch (error) {
        console.log("Error: Couldn't delete the Review", error);
        res.status(500).send({ message: "Error while deleting review", error: error.message });
    };
});




module.exports = Router;



