import { ref } from "vue";
import type { Gallery, GalleryImage } from "../index.d";

const galleryList = ref( <Gallery[]>[] );
const allGalleries = ref( new Map() );
const allImages = ref( <GalleryImage[]>[] );
const isInitialized = ref( false );
export default function useGallery()
{
    const initialize = async( force : boolean ) =>
    {
        if( !force && isInitialized.value ) return;
        await loadGalleries();
        await Promise.all( Array.from( galleryList.value ).map( gallery => loadGallery( gallery.id ) ) );
        isInitialized.value = true;
    };
    const loadGallery = async( galleryName : string ) =>
    {
        allGalleries.value.set( galleryName, <GalleryImage[]>( await ( await fetch( `galleries/${ galleryName }/index.json` ) ).json() ) );
        allImages.value.push( ...allGalleries.value.get( galleryName ) );
    };
    const loadGalleries = async() =>
    {
        galleryList.value = await ( await fetch( `galleries/index.json` ) ).json();
    }

    const getImagePath = ( element : GalleryImage, thumbnail : boolean ) =>
    {
        if( !element ) return "";
        return `galleries/${ element.gallery }/${ thumbnail ? element.thumbnail : element.filename }`
    }
    return {
        initialize, isInitialized, allImages, allGalleries, galleryList, getImagePath
    }
}
