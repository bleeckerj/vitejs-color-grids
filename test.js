import domtoimage from 'dom-to-image';
import $, { event } from "jquery";


$('#donebutton').on("click", function(e) {
    document.getElementById('dom2img').style.left = '50px';
    domtoimage.toJpeg(document.getElementById('dom2img'), { quality: 0.95 })
    .then(function (dataUrl) { 
        //var img = dataUrl;

        // var justBase64Data = img.split("image/jpeg;base64,")[1]
        // const data = fromString(justBase64Data, 'base64');
        var link = document.createElement('a');
        link.download = 'LeWittttttttt.jpeg';
        link.href = dataUrl;
        link.click();
    })

//alert('done clicked');


});