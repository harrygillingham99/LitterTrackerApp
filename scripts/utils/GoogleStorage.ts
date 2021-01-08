const GoogleStorageUrlTemplate = "https://storage.googleapis.com/litter-tracker.appspot.com/"

export const GetGoogleImageUrlsFromList = (imageUrls?: string[]) => {
    if(imageUrls === undefined) return;
    return imageUrls.map(x => `${GoogleStorageUrlTemplate}${x}`)
}

export const GetGoogleIconUrlFromList = (imageUrls?: string[]) => {
    if(imageUrls === undefined) return;
    if(imageUrls[0] === undefined) return;
    
    return GoogleStorageUrlTemplate.concat(imageUrls[0]);
}

export const GetGoogleImageUrlFromItem = (imageFileName: string) => {
    return `${GoogleStorageUrlTemplate}${imageFileName}`
}