import * as $ from 'jquery';

export class VideoFrame{

    constructor(){

    }

    public static setURL(id, url){
        setTimeout((_id, _url)=>{
            console.log(_id, _url)
            $('#'+_id).attr('src', _url);
        }, 500, id, url);
    }

}
