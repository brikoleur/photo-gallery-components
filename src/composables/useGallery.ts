import { computed, ref } from "vue";
import { useRoute } from "vue-router";

export interface GalleryImage {
    gallery : string;
    filename : string;
    thumbnail : string;
    title : string;
    description: string;
}
export interface Gallery {
    id : string;
    title : string;
    description : string;
    size : number;
    titleImage : GalleryImage;
}
const galleryList = ref( <Gallery[]> [] );
const allGalleries = ref( new Map() );
const allImages = ref( <GalleryImage[]> [] );
const isInitialized = ref( false );
export default function useGallery()
{
    const initialize = async ( force: boolean ) =>
    {
        if( !force && isInitialized.value ) return;
        await loadGalleries();
        await Promise.all( Array.from( galleryList.value ).map( gallery => loadGallery( gallery.id ) ) );
        isInitialized.value = true;
    };
    const currentGallery = computed( () =>
    {
        const route = useRoute();
        if( route.name === "gallery" )
        {
            return galleryList.value.find( entity => entity.id === route.query.gallery );
        }
        else
        {
            return undefined;
        }
    } );
    const loadGallery = async ( galleryName : string ) =>
    {
        allGalleries.value.set( galleryName, <GalleryImage[]> ( await ( await fetch( `galleries/${galleryName}/index.json` ) ).json() ) );
        allImages.value.push( ...allGalleries.value.get( galleryName ) );
    };
    const loadGalleries = async () =>
    {
        galleryList.value = await ( await fetch( `galleries/index.json` ) ).json();
    }

    const getImagePath = ( element: GalleryImage, thumbnail: boolean ) => {
        if( !element ) return "";
        return `galleries/${element.gallery}/${thumbnail ? element.thumbnail : element.filename}`
    }
    return {
        initialize, isInitialized, currentGallery, allImages, allGalleries, galleryList, getImagePath
    }
}
