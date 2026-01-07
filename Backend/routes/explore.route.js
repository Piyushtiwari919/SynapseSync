import {Router} from "express";
import { userAuth } from "../middlewares/auth.js";
import getProfiles from "../controllers/explore.contoller.js";

const exploreRouter = Router();

exploreRouter.get("/explore",userAuth, getProfiles);

export default exploreRouter;