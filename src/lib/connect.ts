import mongoose from "mongoose";
import "dotenv/config";

const connect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose
    .connect(
      process.env.NEXT_PUBLIC_DATABASE_URL! 
    )
    .then(() => {
      console.log("done connect to database");
    })
    .catch((error) => {
      console.log("error in connect", error);
    });
};

export default connect;

// ||
        // "mongodb+srv://reemsina:A6dg7ia4%40@cluster0.f01jr9o.mongodb.net/marketplace"