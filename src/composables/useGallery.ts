import { ref } from "vue";
export interface GalleryImage {
    gallery : string;
    filename : string;
    thumbnail : string;
    title : string;
    description: string;
}

export default function useGallery()
{
    const galleryIndex = ref( [] );
    const loadGallery = async ( galleryName : string ) =>
    {
        const galleryData = await ( await fetch( `galleries/${galleryName}/index.json` ) ).json();
        galleryIndex.value = galleryData;
        return galleryData;
    };
    const isFullscreen = ref( false );

    const getImagePath = ( element: GalleryImage, thumbnail: boolean ) => {
        if( !element ) return "";
        return `galleries/${element.gallery}/${thumbnail ? element.thumbnail : element.filename}`
    }
    return {
        galleryIndex, loadGallery, isFullscreen, getImagePath
    }
}
