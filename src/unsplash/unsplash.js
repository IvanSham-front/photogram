import Unsplash from "unsplash-js";
import { accessKey, secretKey } from "./keys";

const unsplashUser = new Unsplash({
    accessKey: accessKey,
    secret: secretKey,
    callbackUrl: 'http://localhost:3000'
  })

export default unsplashUser