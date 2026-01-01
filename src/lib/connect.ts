import mongoose from "mongoose";
import "dotenv/config";

const connect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return await  mongoose
    .connect(
      process.env.DATABASE_URL||'mongodb+srv://reemsina:A6dg7ia4%40@cluster0.f01jr9o.mongodb.net/marketplace'
    )
    .then(() => {
      console.log("done connect to database");
    })
    .catch((error) => {
      console.log("error in connect", error);
    });
};

export default connect;
