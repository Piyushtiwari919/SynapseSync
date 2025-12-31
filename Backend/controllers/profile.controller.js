import { getSanatizedUser } from "../utils/userSanatization.js";

const handleProfileView = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User Not Found");
    }
    const sanatizedUser = getSanatizedUser(user);
    return res.status(200).send(sanatizedUser);
  } catch (error) {
    return res.status(400).send(`ERROR: ${error.message}`);
  }
};

const handleProfileEdit = async (req,res)=>{
    try {
        //Code
    } catch (error) {
        return res.status(400).send(`ERROR: ${error.message}`);
    }
};


export { handleProfileView, handleProfileEdit };
