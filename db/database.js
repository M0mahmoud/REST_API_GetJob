import { connect } from "mongoose";

export async function connectDB() {
  try {
    await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error("MongoDB Error", error);
  }
}
