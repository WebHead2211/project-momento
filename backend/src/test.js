import { User } from "./models/user.model.js";

const allNoti = async () => {
  try {
    const response = await User.updateMany({}, { $set: { notifications: [] } });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

allNoti();
