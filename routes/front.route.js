import express from "express";

const homeRouter = express.Router();

// Define a route for the main page
homeRouter.get("/", (req, res) => {
    res.send("Welcome to the Cash App - <a href='/dashboard'>Dashboard</a>");
});

export default homeRouter;
