/* 
  ApiConfig.ts
  A config file used in development to easily swap between my home server staging version and the 'production' version of the back end.
*/

const uri = `http://192.168.0.69:82`

const prodUri = `https://litter-tracker.ew.r.appspot.com` //TODO: swap this URL when its time to hand in & deploy latest backend

export const ApiUrl = prodUri;