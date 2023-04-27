import type { App } from "vue";
import PGalleriesEditor from "./components/edit/PGalleriesEditor.vue";
import PGalleryEditor from "./components/edit/PGalleryEditor.vue";
import PImagePicker from "./components/edit/PImagePicker.vue";
import PCarousel from "./components/gallery/PCarousel.vue";
import PGalleries from "./components/gallery/PGalleries.vue";
import PMosaic from "./components/gallery/PMosaic.vue";
import PTitleImage from "./components/gallery/PTitleImage.vue";
export default {
    name : "PhotoGalleryComponents",
    install( app: App )
    {
        app.component( "PGalleriesEditor", PGalleriesEditor );
        app.component( "PGalleryEditor", PGalleryEditor );
        app.component( "PImagePicker", PImagePicker );
        app.component( "PCarousel", PCarousel );
        app.component( "PGalleries", PGalleries );
        app.component( "PMosaic", PMosaic );
        app.component( "PTitleImage", PTitleImage );
    }
}