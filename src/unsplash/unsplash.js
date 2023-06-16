import Unsplash from "unsplash-js";
import { accessKey, secretKey } from "./keys";

const callbackUrl = window.location.origin

const unsplashUser = new Unsplash({
    accessKey: accessKey,
    secret: secretKey,
    callbackUrl
  })

export default unsplashUser