const express = require("express");
const zod = require("zod");
const { User, Account } = require("../db");
// const JWT_SECRET = require("../config");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");
const { JWT_SECRET } = require("../config");
const router = express.Router();


const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
  });

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

router.post("/signup", async (req, res) => {
    try {
      // Validate the request body using Zod schema
      const parseResult = signupSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        console.log("Validation failed:", parseResult.error);
        return res.status(400).json({
          message: "Invalid input data",
          error: parseResult.error.errors
        });
      }
  
      console.log("After !success");
  
      // Check if the user already exists
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        console.log("User already exists:", existingUser);
        return res.status(400).json({
          message: "Email already taken"
        });
      }
  
      // Create a new user in the database
      const dbUser = await User.create(req.body);
      console.log("New user created:", dbUser);
  
      // Create an account with a random balance
      await Account.create({
        userId: dbUser._id,
        balance: 1 + Math.random() * 10000
      });
  
      // Generate a JWT token
      const token = jwt.sign({ userId: dbUser._id }, JWT_SECRET);
  
      // Send a successful response
      res.json({
        message: "User created successfully",
        token: token
      });
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  });
  

router.post("/signin", async(req, res) => {

    const {success} = signinSchema.safeParse(req.body);

    if(!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.user.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        });
        return;
    };

    res.status(411).json({
        message: "Error while logging in"
    });


});

router.put("/", authMiddleware, async(req, res) => {
    const {success} = updateBody.safeParse(req.bady);

    if(!success) {
        res.status(411).json({
            message: "Error While updating information"
        });
    }

    await User.updateOne(req.body, {
        id: req.userId
    });

    res.json({
        message: "Updated Successfully"
    });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
      $or: [{
          firstName: {
              "$regex": filter
          }
      }, {
          lastName: {
              "$regex": filter
          }
      }]
  })

  res.json({
      user: users.map(user => ({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id
      }))
  })
})

module.exports = router;

