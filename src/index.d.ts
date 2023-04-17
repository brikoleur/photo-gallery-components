export declare interface GalleryImage {
    gallery : string;
    filename : string;
    thumbnail : string;
    title : string;
    description: string;
}
export declare interface Gallery {
    id : string;
    title : string;
    description : string;
    size : number;
    titleImage : GalleryImage;
}
