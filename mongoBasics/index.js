const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/moviesApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Open!");
  })
  .catch((err) => {
    console.log("ERROR: ");
    console.log(err);
  });

const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  score: Number,
  rating: String,
});

const Movie = mongoose.model("Movie", movieSchema);
// const amadeus = new Movie({
//   title: "Amadeus",
//   year: 1986,
//   score: 9.2,
//   rating: "R",
// });

Movie.insertMany([
  { title: "Ron's Gone Wrong", year: 2021, score: 7.5, rating: "PG" },
  { title: "Don't", year: 1969, score: 4.2, rating: "R" },
  { title: "Ed Sheeran", year: 2022, score: 6.3, rating: "PG-13" },
  { title: "Yesterday", year: 2018, score: 6.8, rating: "PG-13" },
  { title: "The Iron Giant", year: 1999, score: 8.1, rating: "PG" },
])
  .then((data) => {
    console.log("It Worked!");
    console.log(data);
  })
  .catch((err) => {
    console.log("It Failed!");
    console.log(err);
  });
