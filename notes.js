// To get IPFS working, I added this line to the index.html page to include this js-ipfs
<script src="https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js"></script>
// Then in my main JS file
var ipfs = await Ipfs.create()
// And when I want to add something this sorta thing
 /* IPFS Upload Stuff Here
        let result = ipfs.add(fileDetails, options).then(function (result) {
          console.log(result.cid._baseCache.get('z'));
          var addRecv = result;
          var cid = result.cid._baseCache.get('z');
          imageCID = cid;
          var imageURL = "ipfs://"+cid+"/lewittttttttt.jpg";

          console.log(addRecv);
          var metaObj = {name : "LEWITTTTTTTTT", "image" : imageURL, "external_url": "lewittttttttt.xyz", description: "", "attributes": [{"instructions" : instrText, "dom" : dom, "image-base64-jpeg": justBase64Data}] }
          var jsonObj = JSON.stringify(metaObj);
          //console.log(jsonObj);
          ipfs.add(
            jsonObj,
            ).then(function (result) {
            console.log(result);
            console.log(result.path);
            metaDataCID = result.path;
            document.getElementById('chips').innerText = "ipfs://"+metaDataCID+" ipfs://"+imageCID;

          });
        });
*/


var scheme = new ColorScheme;
console.log(scheme);
scheme.from_hue((Math.random() * 360)).scheme('tetrade').variation('default');
//var colors = scheme.colors();
var start = chroma.hsl(Math.random() * 360, 1, 1);
console.log(start);
//var colors = chroma.scale(start).classes(16).mode('hsl').colors(16); // gradient
var colors = chroma.scale(['#fafa6e','#2A4858']).mode('rgb').colors(16);
colors = chroma.scale([scheme.colors()[0], scheme.colors()[4]]).classes(32).mode('rgb').colors(8); // flat from start
colors = chroma.scale(['F3696E', 'F8A902']).classes(2).mode('rgb').colors(8); // start and finish
//console.log( chroma.scale('OrRd').classes(16).mode('hsl').colors(16) );
console.log(colors);




var rect = ev.target.getBoundingClientRect();
console.log(ev.center);
var x = ev.center.x - rect.left; //x position within the element.
var y = ev.center.y - rect.top;  //y position within the element.
console.log("Left? : " + x + " ; Top? : " + y + ".");
console.log("Height "+rect.height);
var qH = y / rect.height;
console.log("qH="+qH);


ipfs://QmVhPdVRseGKZykyXDdPqd6k4qKDginfj5o9foz9anqChK

ipfs://QmQoFTpsED17AWYbWvg7MD5KVYXrqwu1VX2f7UY2e9NsT6

"QmddNHAhc6VHKzKxwQKTuDN5mGXYXRnzHe6ZL65B3Nk2CJ"

ipfs://QmcDdQVSzfRCFxqbB5kai9GhJ3kDY4Fq9Ap7rvrusTKxsu

ipfs://QmeaT8rDYdPTR3RQd4rCdqkUkRcBzboTJ27bW2apUMwwPC

ipfs://Qmc8nZsMocy2BKc6N41GaKGsnxahARzHPGfkvpbGspcXum 
ipfs://Qme2v8DqtT82aALcrU5btAypbQX11ewFjAaUgyed6d2RPD

ipfs://QmT84c5ZUNsKr5v8Hb4WKbMBwAxBHvSXozmtGc4eczkast 
ipfs://QmSELhR3VWn82bg8cV88gYVJAPrWDM6Zp1A9qyaiT4fGXi

ipfs://QmV1Jm1xacB8hPg1n9bhWv36gTnz7fuKMFJd8PHsgpsbZ5 
ipfs://QmPHeKmPubhNeBqEFSGpkjZXuppNmDWWPe8qJCMVcg7ncP