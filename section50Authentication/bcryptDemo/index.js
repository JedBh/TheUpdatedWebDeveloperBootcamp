const bcrypt = require("bcrypt");

// const hashPassword = async (pw) => {
//   const salt = await bcrypt.genSalt(12);
//   const hash = await bcrypt.hash(pw, salt);
//   console.log(salt);
//   console.log(hash);
// };

const hashPassword = async (pw) => {
  const hash = await bcrypt.hash(pw, 12);
  console.log(hash);
};

const login = async (pw, hashedPw) => {
  const result = await bcrypt.compare(pw, hashedPw);
  if (result) {
    console.log("Logged you in");
  } else {
    console.log("Incorrect, try again");
  }
};

// hashPassword("password");
login(
  "password",
  "$2b$12$qUz8LnH1wihDDpuXAlA01O0Xm0oqTyWGLGqxJiAk2Gu7KIAnU/8xe"
);
