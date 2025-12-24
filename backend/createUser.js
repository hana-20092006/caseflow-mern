const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/caseflow");

async function createUser() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  await User.create({
    name: "Admin Official",
    email: "official@caseflow.com",
    password: hashedPassword,
    role: "official",
  });

  await User.create({
    name: "Citizen User",
    email: "citizen@caseflow.com",
    password: hashedPassword,
    role: "citizen",
  });

  console.log("Users created");
  process.exit();
}

createUser();
