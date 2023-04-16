import { computed, ref } from "vue";
import { useRoute } from "vue-router";
const currentGallery = ref();

export interface GalleryImage {
    gallery : string;
    filename : string;
    thumbnail : string;
    title : string;
    description: string;
}
const galleryList = ref( [] );
const allImages = ref( [] );
export default function useGallery()
{
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
    const galleryIndex = ref( [] );
    const loadGallery = async ( galleryName : string ) =>
    {
        galleryIndex.value = await ( await fetch( `galleries/${galleryName}/index.json` ) ).json();
        return galleryIndex.value;
    };
    const loadGalleries = async () =>
    {
        galleryList.value = await ( await fetch( `galleries/index.json` ) ).json();
        return galleryList.value;
    }
    const loadAllImages = async () =>
    {
        const galleries = await loadGalleries();
        for( const gallery of galleries )
        {
            allImages.value.push( ...( await loadGallery( gallery.id ) ) );
        }
        return allImages.value;
    };
    const isFullscreen = ref( false );

    const getImagePath = ( element: GalleryImage, thumbnail: boolean ) => {
        if( !element ) return "";
        return `galleries/${element.gallery}/${thumbnail ? element.thumbnail : element.filename}`
    }
    return {
        loadAllImages, currentGallery, allImages, galleryIndex, galleryList, loadGallery, loadGalleries, isFullscreen, getImagePath, currentGallery
    }
}
