const mongoose = require("mongoose");
const { Schema } = mongoose;
// connecting to mongodb
main()
  .then(() => {
    console.log("Mongo Connected");
  })
  .catch((err) => console.log("Mongo Connection Error", err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/relationshipDemo");
}

const userSchema = new Schema({
  username: String,
  age: Number,
});

const tweetSchema = new Schema({
  text: String,
  likes: Number,
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const User = mongoose.model("User", userSchema);
const Tweet = mongoose.model("Tweet", tweetSchema);

// const makeTweets = async () => {
//   //   const user = new User({ username: "chickenfan99", age: 61 });
//   const user = await User.findOne({ username: "chickenfan99" });
//   const tweet2 = new Tweet({
//     text: "bock bock bock! My chicken make noises",
//     likes: 1234,
//   });
//   tweet2.user = user;
//   //   user.save();
//   tweet2.save();
// };

const findTweets = async () => {
  const t = await Tweet.find({}).populate("user", "username");
  console.log(t);
};

// makeTweets();
findTweets();
