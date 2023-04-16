declare type GalleryImage = {
    gallery : string;
    filename : string;
    thumbnail : string;
    title : string;
    description: string;
}
declare type Gallery = {
    id : string;
    title : string;
    description : string;
    size : number;
    titleImage : GalleryImage;
}
export { Gallery, GalleryImage }
