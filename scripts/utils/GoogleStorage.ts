const GoogleStorageUrlTemplate = "https://storage.googleapis.com/litter-tracker.appspot.com/"

export const GetGoogleImageUrl = (imageName: string) => {
    return GoogleStorageUrlTemplate.concat(imageName);
}

export const GetGoogleIconUrlFromList = (imageUrls?: string[]) => {
    if(imageUrls === undefined) return;
    return GoogleStorageUrlTemplate.concat(imageUrls[0]);
}