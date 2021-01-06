const GoogleStorageUrlTemplate = "https://storage.googleapis.com/litter-tracker.appspot.com/"

export const GetGoogleImageUrl = (imageName: string) => {
    return GoogleStorageUrlTemplate.concat(imageName);
}