import mongoose from "mongoose";
import "dotenv/config";

const connect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return await  mongoose
    .connect(
      process.env.DATABASE_URL! 
    )
    .then(() => {
      console.log("done connect to database");
    })
    .catch((error) => {
      console.log("error in connect", error);
    });
};

export default connect;
