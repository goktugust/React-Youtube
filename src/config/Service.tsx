import axios from "axios";

const key = "AIzaSyBsNRKStOaIsD5Df6mRRxMQ2E_Cix4cyUY";

const service = axios.create({
    baseURL:'https://youtube.googleapis.com/youtube/v3/'
})

export function getVideos(searchInput: string) {
    const prm = {
        part:"snippet",
        q: searchInput,
        type: "video",
        videoEmbeddable: true,
        maxResults:6,
        key: key
    }
    return service.get("search", {params:prm})
}