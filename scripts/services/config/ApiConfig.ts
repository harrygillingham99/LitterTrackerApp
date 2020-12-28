import Constants from "expo-constants";

const { manifest } = Constants;

const uri = `https://${manifest.debuggerHost.split(':').shift()}:44307`

export const ApiUrl = uri;