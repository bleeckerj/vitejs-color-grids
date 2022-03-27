import './style.css'
//import CID from "ipfs-http-client";

import $, { event } from "jquery";
import { ethers } from "ethers";
import { randomColor } from "randomcolor";
import chroma from "chroma-js";
import domtoimage from 'dom-to-image';
import ColorScheme from 'color-scheme';
import { jsPDF } from "jspdf";
//import jscolor from "jscolor";
import { fromString } from 'uint8arrays/from-string'
import theJson from './palettes/palettesJson.json'
//import {uploadBlob} from "./scripts/ipfs";
//import fetch from 'node-fetch'

//console.log(uploadBlob);

// top-level await shenanigans..
//var ipfs = await Ipfs.create()

// const { cid } = await ipfs.add('Goodbye world');
// console.log(ipfs);
// console.log(cid);
// import spectrumColorpicker from 'spectrum-colorpicker2';

var borderColor = "black";
var borderWidth = 2;
var outlineOffset = 2;
var clickCount = 0;
var blockIndex = 0;
var colorIndex = 0;
var blockBuild = new Array();


// var colors = scheme.colors();
// var scale = chroma.scale([`hsla(${Math.random() * 360}, 100%, 60%, 1)`,`hsla(${Math.random() * 360}, 40%, 90%, 1)`]).mode('hsl').colors(20);
// console.log(scale);
// /*
// const provider = new ethers.providers.Web3Provider(
//   window.ethereum,
//   "any"
// );
// await provider.send("eth_requestAccounts", []);
// const signer = provider.getSigner();

// (async function () {
//   let userAddress = await signer.getAddress();
//   document.getElementById("wallet").innerText =
//     "Your wallet is " + userAddress;
    
// })();
computeColorsArray();
console.log(colors)


function getLowestFraction(x0) {
  var eps = 1.0E-15;
  var h, h1, h2, k, k1, k2, a, x;

  x = x0;
  a = Math.floor(x);
  h1 = 1;
  k1 = 0;
  h = a;
  k = 1;

  while (x-a > eps*k*k) {
      x = 1/(x-a);
      a = Math.floor(x);
      h2 = h1; h1 = h;
      k2 = k1; k1 = k;
      h = h2 + a*h1;
      k = k2 + a*k1;
  }

  return h + "/" + k;
}

function recordBlockBuild(sourceDiv, siblingDiv, direction, orientation="BELOW") {
  if(sourceDiv != null) {
    var name_0 = sourceDiv.id;
    var width_0 = sourceDiv.clientWidth;
    var height_0 = sourceDiv.clientHeight;
    var bgColor_0 = $("#"+sourceDiv.id).css("background-color");
    //console.log("Recorded: "+sourceDiv.clientHeight+" "+siblingDiv.clientHeight);

    var name_1 = siblingDiv.id;
    var width_1 = siblingDiv.clientWidth;
    var height_1 = siblingDiv.clientHeight;
    var bgColor_1 = $("#"+siblingDiv.id).css("background-color");

    blockBuild.push([name_0, width_0, height_0, bgColor_0, name_1, width_1, height_1, bgColor_1, direction, orientation]);
} else {
    var name_1 = siblingDiv.id;
    var width_1 = siblingDiv.clientWidth;
    var height_1 = siblingDiv.clientHeight;
    var bgColor_1 = $("#"+siblingDiv.id).css("background-color");

  blockBuild.push([null, null, null, null, name_1, width_1, height_1, bgColor_1, direction, orientation]);
  }
  // console.log(direction);
  // blockBuild.push([sourceDiv, siblingDiv, direction]);
  console.log(blockBuild);
}


function unfurlBlockBuild() {
  var text = new String();
  var stepNumber = 1;
  blockBuild.forEach((element) => {
    var name_0 = element[0];
    var width_0 = element[1];
    var height_0 = element[2];
    var ratio_0 = getLowestFraction(width_0/height_0);
    var bgColor_0 = element[3];
    console.log(element);

    var name_1 = element[4];
    var width_1 = element[5];
    var height_1 = element[6];
    var ratio_1 = getLowestFraction(width_1/height_1);
    var bgColor_1 = element[7];
    var direction = element[8];
    var orientation = element[9];

    text += stepNumber+". "
    if (direction != "PLACE") {
      if (direction == "HORIZONTAL") {
        text += "Divide the block referred to as '"+name_0+"' along the "+direction+" axis, making its width now "+width_0+" units and height now "+height_0+" units (a size ratio of "+ratio_0+").";
        text += "\r\nAdd a new block "+orientation+" '"+name_0+"' with a width of "+width_1+" units and a height of "+height_1+" units (a size ratio of "+ratio_1+").";
        text += "\r\nRefer to this block as '"+name_1+"' and make its color correspond to an RGB value of "+bgColor_1;
      } else {
        text += "Divide the block referred to as '"+name_0+"' along the "+direction+" axis, making its width now "+width_1+" units and height now "+height_1+" units (a size ratio of "+ratio_1+").";
        text += "\r\nAdd a new block to the right of '"+name_0+"' with a width of "+width_1+" units and a height of "+height_1+" units (a size ratio of "+ratio_1+").";
        
        text += "\r\nRefer to this block as '"+name_1+"' and make its color correspond to an RGB value of "+bgColor_1+".";
      }
      // console.log("A block with a width of "+width_1+" units and height of "+height_1+" units (a size ratio of "+ratio_1+")");
      // console.log("Refer to this block as '"+name_1+"' and make its color correspond to an RGB value of "+bgColor_0);
    //console.log(element[2]);
    } else {
      text += "Start with a block with a width of "+width_1+" units and a height of "+height_1+" units (a size ratio of "+ratio_1+").";
      text += "\r\nRefer to this block as '"+name_1+"' and make its color correspond to an RGB value of "+bgColor_1+".";
      // console.log("Start with a block with a width of "+width_1+" units and a height of "+height_1+" units (a size ratio of "+ratio_1+")");
      // console.log("Refer to this block as '"+name_1+"' and make its color correspond to an RGB value of "+bgColor_1);
    } 
    //console.log(text);
    text += "\r\n\r\n";
    stepNumber++;
  });
  //console.log(text);
  document.getElementById("instructions").innerText = text;

  return text;
}

var colors;
var colorPaletteIndex = Math.round(Math.random()*theJson.palettes.length-1);
var rndColorsFromPalette = theJson.palettes[colorPaletteIndex].rgb.split('-').map(color => 
  '#' + color
);
console.log(rndColorsFromPalette);

function computeColorsArray(start = '#fafa6e', end = '#41D067') {
  //var scheme = new ColorScheme;
  //console.log(scheme);
  //scheme.from_hue((Math.random() * 360)).scheme('tetrade').variation('default');
  //var colors; = scheme.colors();
  //console.log(chroma.scale(['#fafa6e','#2A4858'])(0.5).hsl());
//colors = chroma.scale(['#fafa6e', '#fafa6e']).mode('lch').colors(6); // start and finish
  var colorCount = parseInt($('#colorcount').val());
  colors = chroma.scale([start, end]).colors(colorCount);//colors = ['ff0000', '00ff00', '0000ff'];
  if (colorCount == 1) {
    colors = [start];
  }
  console.log(colors);
}

function randomHsl() {
  //var r = `hsla(${Math.random() * 360}, 100%, 60%, 1)`;
  var index = colorIndex % colors.length

  index = colorIndex % rndColorsFromPalette.length;

  if(colors.length == 1) {
    index = 0;
  }
  var h = chroma(colors[index]).hsl();
  console.log(colors[index]);
  console.log(h);
  var c = `hsla(`+h[0]+`,`+h[1]*100+`%,`+h[2]*100+`%,`+h[3]+`)`;
  var x = chroma(colors[index]).rgb();
  return `rgb(`+x[0]+`,`+x[1]+`,`+x[2]+`)`
}

function randomPaletteHexColor() {
  var index = colorIndex % colors.length
  index = colorIndex % rndColorsFromPalette.length;
  var paletteHexColor = rndColorsFromPalette[index];
  console.log(paletteHexColor);
  return paletteHexColor;
}

function randomRGB() {
  var h = chroma(colors[0]);
  //console.log(h.hex());
  return h;
}

function getRandomColor() {
  // let rgb =  randomColor({ luminosity: 'light', format: 'hsla' });
  // console.log(rgb);
  // // let c = randomHsl();
  // // console.log(c);
  // console.log(randomHsl());
  // return randomColor({ hue: 'light', format: 'hsla' });
  //return randomHsl();
  console.log($('#colorfrom_g').val());
  console.log($("input[name=colorfrom]:checked").val());
  var whichType = $("input[name=colorfrom]:checked").val();

  if (whichType == 'palette') {
    return randomPaletteHexColor();
  } else {
    return randomHsl();
  }

  //return randomPaletteHexColor();
}

function clearAndRestart() {
  // clear the instruction array
  // clear all the elements except block_0
}

function divideMeHorizontal(event, factor=0.25) {
  var source = event.target;
  var orientation = "BELOW";
  var oldHeight = Math.round(parseFloat($(source).css("height")));
  if (oldHeight <= 10) {
    return;
  }
  
  var divFactor = getDivisionFactor(source, event);
  console.log("qH="+divFactor.qH);
  
  var newHeight = Math.round((0.5)*oldHeight); // default to 50%
  // bottom so the existing block is going to be 1-factor * height
  if (divFactor.qH <= factor || divFactor.qH > (1-factor)) {

    if (divFactor.qH > (1-factor)) {
      newHeight = Math.round((1-factor)*oldHeight);
      orientation = "BELOW";
    }
    if (divFactor.qH <= (factor)) {
      newHeight = Math.round((1-factor)*oldHeight);
      // we clicked up in the top, so move the source down
      // because we'll be adding the new guy above
      var sourcePosition = $(source).position();
      var jugDownPixels = Math.round((factor)*oldHeight)
      var newTopPixelsStr = Math.round(jugDownPixels +  sourcePosition.top)+"px";
      //console.log("newTopPixelsStr="+newTopPixelsStr);
      $(source).css({ top: newTopPixelsStr })
      orientation = "ABOVE";
    }
  } else {
    console.log("WTF WTF WTF");
  }

  $(source).height(newHeight);
  
  addToMeHorizontal(event, oldHeight, divFactor, factor);

  return orientation;
}

function addToMeHorizontal(event, oldHeight, divFactor, factor=0.25) {
  var source = event.target;
  //var divFactor = getDivisionFactor(source, event);
  //console.log("qH="+divFactor.qH);
  var sourcePosition = $(source).position();
  console.log("source.position="+$(source).position());
  console.log("source.height="+$(source).height());
  var sourceOldHeight = oldHeight;//Math.round(parseFloat($(source).css("height")));
  var sourceNewHeight = $(source).height();
  //var sourceBottom = $(source).position().top + $(source).offset().top + $(source).outerHeight(true);
  //var top = parseInt(sourcePosition.top);
  
  var newElementHeight = Math.round((0.5)*sourceOldHeight);
  var newElementTop =  Math.round(sourcePosition.top + 0.5*sourceOldHeight); // default divide in half
  var oldElementTop;

  if (divFactor.qH <= factor || divFactor.qH > (1-factor)) {
    if (divFactor.qH > (1-factor)) {
      newElementHeight = Math.round((factor)*sourceOldHeight);
      console.log("OLD TOP STAYS")
      newElementTop = Math.round(sourcePosition.top + sourceNewHeight);
    } 
    if (divFactor.qH <= factor) {
      newElementHeight = Math.round((factor)*sourceOldHeight);
      console.log("OLD TOP ROLLS DOWN BY "+factor*sourceOldHeight)
      newElementTop = sourcePosition.top - factor*sourceOldHeight;
    } 
  } else {
    console.log("NEITHER NEITHER NEITHER");
    newElementHeight = Math.round(0.5*sourceOldHeight);
  }
  var newElementHeightStr = newElementHeight.toString()+"px";
  var topStr = newElementTop.toString()+"px";

  var width = Math.round(parseFloat($(source).css("width")));
  var widthStr = (width).toString()+"px";

  var position = $(source).position();
  var left = Math.round(position.left);
  
  blockIndex++;
  colorIndex++;

  var bgColor = getRandomColor();
  
  var template = "<div id='block_"+blockIndex+ "' style=' position: absolute; left: "+left+"px; top: "+topStr+"; height: "+newElementHeightStr+"; width: "+widthStr+"; outline:  "+borderWidth/2+"px solid "+borderColor+"; outline-offset: -"+outlineOffset/2+"px; background-color:"+bgColor+"'></div>";

  $(source).after(template);
  var myElement = document.getElementById('block_'+blockIndex);

// We create a manager object, which is the same as Hammer(), but without the presetted recognizers. 
  var mc = new Hammer.Manager(myElement);
  mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
  // Single tap recognizer
  mc.add( new Hammer.Tap({ event: 'singletap' }) );
  mc.add( new Hammer.Press({ event: 'press', time: 800 }) );
  mc.add( new Hammer.Press({ event: 'pressup', time: 1200 }));
  // we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
  //mc.get('doubletap').recognizeWith('singletap');
  // we only want to trigger a tap, when we don't have detected a doubletap
  //mc.get('singletap').requireFailure('doubletap');

  mc.on("singletap press pressup", function(ev) {
    document.getElementById("instructions").innerText = ''
    //console.log(ev.type);
    if(ev.type == 'singletap') {
      divideMeLeft(ev.target);
      addToMeLeft(ev.target);
      recordBlockBuild(document.querySelector("#"+ev.target.id), document.querySelector("#block_"+blockIndex), "HORIZONTAL");

    }
    if(ev.type == 'press') {
      console.log("REGULAR PRESS");
      var orientation = divideMeHorizontal(ev, 0.25);
      recordBlockBuild(document.querySelector("#"+ev.target.id), document.querySelector("#block_"+blockIndex), "HORIZONTAL", orientation);

    }
    if(ev.type == 'pressup') {
      console.log("SUPER PRESS!!!");
      console.log(ev);
    }
 });
 //console.log(document.querySelector("#"+source.id).offsetHeight);

}

function divideMeLeft(source) {
  // var color = $(dest).css("background-color");
  // console.log(color);
  var height = Math.round(parseFloat($(source).css("height")));
  var width = Math.round(parseFloat($(source).css("width")));
  var new_height = height;
  var new_width = Math.round((width) / 2);
  var x = new_height.toString()+"px";
  var y = new_width.toString()+"px";
  $(source).animate({width: y}, 500);
  //$(source).css("outline", "2px solid white");
  // $(source).css("float", "left");
}


function addToMeLeft(source) {
  var sourceWidth = parseFloat($(source).css("width"));
  var destWidth = (Math.round(sourceWidth/2)).toString()+"px";
  var sourceHeight = parseFloat($(source).css("height"));
  var destHeight = sourceHeight.toString()+"px";
  var sourcePosition = $(source).position();
  var top = parseInt(sourcePosition.top);
  var left = parseInt(sourcePosition.left);
  console.log("top="+top+" left="+left+" right="+parseInt(left+sourceWidth/2));
  var newLeft = left+Math.round(sourceWidth/2);
  // console.log("new_left="+new_left+" width/2="+width/2);
  blockIndex++;
  colorIndex++;
  // new template we're adding
  var template = "<div id='block_"+blockIndex+ "' style='position: absolute; left: "+newLeft+"px; top: "+top+"px; height: "+destHeight+"; width: "+destWidth+"; outline:  "+borderWidth/2+"px solid "+borderColor+"; outline-offset: -"+outlineOffset/2+"px; background-color:"+getRandomColor()+"'></div>";// $('#redbox').html();

  $(source).after(template);
  const myElement = document.getElementById('block_'+blockIndex);


  /** BOILERPLATE TO ADD A NEW EVENT TO THE NEW BLOCK */
  // We create a manager object, which is the same as Hammer(), but without the presetted recognizers. 
  var mc = new Hammer.Manager(myElement);
  mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
  // Single tap recognizer
  mc.add( new Hammer.Tap({ event: 'singletap' }) );
  mc.add( new Hammer.Press({ event: 'press', time: 800 }) );


  // we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
  mc.get('doubletap').recognizeWith('singletap');
  // we only want to trigger a tap, when we don't have detected a doubletap
  mc.get('singletap').requireFailure('doubletap');

  mc.on("singletap doubletap press", function(ev) {
    document.getElementById("instructions").innerText = ''
    // console.log(ev.type);
    // console.log(ev.target);
    if(ev.type == 'singletap') {
      divideMeLeft(ev.target);
      addToMeLeft(ev.target);
      recordBlockBuild(document.querySelector("#"+ev.target.id), document.querySelector("#block_"+blockIndex), "VERTICAL");
    }
    if(ev.type == 'press') {
      var orientation = divideMeHorizontal(ev, 0.25);
      recordBlockBuild("#"+ev.target.id, document.querySelector("#block_"+blockIndex), "HORIZONTAL", orientation);
      //addToMeHorizontal(ev);
    }
 });


}

// target is a DOM element
function getDivisionFactor(target, event, direction="horizontal") {
  var targetRect = target.getBoundingClientRect();
  //console.log(event.center.x +", "+event.center.y);
  var xRel = event.center.x - targetRect.left; //x position within/relative-to the element.
  var yRel = event.center.y - targetRect.top;  //y position within/relative-to the element.
  //console.log("From Left? : " + xRel + " ; From Top? : " + yRel + ".");
  //console.log("Height "+targetRect.height);
  var qH = yRel / targetRect.height; // what fraction of height are we from the top of the element
  var qV = xRel / targetRect.width;
  //console.log("qH="+qH+" qV="+qV+" "+targetRect);
  return {qH: qH, qV: qV};
}




//
//
//
//

var initSquareBlock = "800px";//getViewportSize()+"px";
$('#bottomcontainer').css('width', initSquareBlock);
$('#bottomcontainer').css('height', initSquareBlock);
$('#topcontainer').css('width', initSquareBlock);
$('#topcontainer').css('height', initSquareBlock);
$('#blocks').css('width', initSquareBlock);
$('#blocks').css('height', initSquareBlock);
var top = 0;//$('#blocks').offset().top;
var left = 0;//$('#blocks').offset().left;
//console.log(top+", "+left);
// console.log(getViewportSize());
// console.log($('#bottomcontainer').css("width"));
// console.log(document.getElementById('bottomcontainer').getBoundingClientRect());
$('#blocks').append("<div id=block_0 style='position: absolute; top: "+top+"px; left: "+left+"; box-sizing: content-box;  height: "+initSquareBlock+"; width: "+initSquareBlock+"; outline:  "+borderWidth/2+"px solid "+borderColor+"; outline-offset: -"+outlineOffset/2+"px; background-color:"+getRandomColor()+"'></div>");//.on("click", divideMe);

var myElement = document.getElementById('block_0');

// We create a manager object, which is the same as Hammer(), but without the presetted recognizers. 
var mc = new Hammer.Manager(myElement);
mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
// Single tap recognizer
mc.add( new Hammer.Tap({ event: 'singletap' }) );
mc.add( new Hammer.Press({ event: 'press', time: 800 }) );

// we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
mc.get('doubletap').recognizeWith('singletap');
// we only want to trigger a tap, when we don't have detected a doubletap
mc.get('singletap').requireFailure('doubletap');
// single to the left
// double vert
mc.on("singletap press", function(ev) {
  document.getElementById("instructions").innerText = ''


   if(ev.type == 'singletap') {
     divideMeLeft(ev.target);
     addToMeLeft(ev.target);
   }
   if(ev.type == 'press') {
    var orientation = divideMeHorizontal(ev, 0.25);
    //console.log(ev.target.id+" "+blockIndex+" "+orientation);
    recordBlockBuild(document.querySelector("#"+ev.target.id), document.querySelector("#block_"+blockIndex), "HORIZONTAL", orientation);
    // divideMeHorizontal(ev, 0.25);
     //addToMeHorizontal(ev);
     
   }
});
// long-press comes from https://github.com/john-doherty/long-press-event
// $('#block_0').on('long-press', function(e) {
//   divideMeLeft(this);
//   addToMeLeft(this);
// })
$('#top').append("Hello");
recordBlockBuild(null, document.querySelector("#block_0"), "PLACE");

$('#instructions').append('<div style="font-size: 10px" class="p-2">TAP/CLICK FOLDS VERT <br/>LONG PRESS FOLDS HORIZ. <br/>THERE IS NO UNDO. <br/>WHEN YOU CLICK \'DONE\' YOU\'LL GET YOUR ART AND A PDF OF INSTRUCTIONS.</div>')

// document.querySelector('#instructions').innerHTML = `<div>DO THIS TO DO THAT. DO THAT TO DO THIS.</div><div>`
$('#instructionbutton').after("<button id=button class=button>DONE</button>");
$('#button').on("click", function(e) {
 var instrText = unfurlBlockBuild();

var node = document.getElementById('blocks');
//console.log(node);
var img;


// domtoimage.toBlob(document.getElementById('blocks')).then(function (blob) {
//   console.log(blob);
//   let result = ipfs.add(blob).then(function (result) {
//    console.log(result);
  
//   });
// });

domtoimage.toJpeg(document.getElementById('blocks'), { quality: 0.95 })
    .then(function (dataUrl) {
      var metaDataCID;
      var imageCID;    
      
      img = dataUrl;
          
        // console.log(img);
        // const foo =  uploadBlob(img).then(function (result) {
        //   console.log(result);
        // });
        var justBase64Data = img.split("image/jpeg;base64,")[1]
        const data = fromString(justBase64Data, 'base64');
        //console.log(data);
        var dom = document.getElementById('blocks').outerText;
        console.log(dom);
        const fileDetails = {
          path: "lewittttttttt.jpg",
          content: data
        };
        
        const options = {
          wrapWithDirectory : true
        };
        /* IPFS Upload Stuff Here
        let result = ipfs.add(fileDetails, options).then(function (result) {
          //ipfs.add(data).then(function (result) {
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
//        console.log(result);
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "in",
          format: "letter"
        });

        doc.setFontSize(8);
        doc.addImage(img, 'JPEG', 0.1, 0.1, 4, 4);
        doc.text(instrText,0.1, 4.2);
        //doc.save("instructions.pdf");

        var link = document.createElement('a');
        link.download = 'lewitt.jpeg';
        link.href = dataUrl;
        link.click();
    });
}); // button on click
$('#walletbutton').after("<button id=button class=button button1;>CONNECT WALLET</button>");

$('#walletbutton').on("click", function(e) {})
//$(function() {
 
//
// If the pickers change or the count change, update the color range
//
  var picker_1 = new JSColor('#cp1');
  document.getElementById('cp1').jscolor.onChange = function() {
    computeColorsArray(this.toHEXString(),document.getElementById('cp2').jscolor.toHEXString() );
    document.getElementById('block_0').style.backgroundColor = this.toHEXString();
  }
  picker_1.fromString(colors[0]);

  var picker_2 = new JSColor('#cp2');
  //document.getElementById('cp2').jscolor.show();
  document.getElementById('cp2').jscolor.onChange = function() {
    computeColorsArray(document.getElementById('cp1').jscolor.toHEXString(),this.toHEXString() );

  }
  picker_2.fromString(colors[colors.length-1]);

  $(document).on('change','#colorcount' ,function(){
    computeColorsArray(document.getElementById('cp1').jscolor.toHEXString(), document.getElementById('cp2').jscolor.toHEXString());
  });

  $('#colorfrom_g').on('click', function() {
    document.getElementById('cp2').hidden = false;
    document.getElementById('cp1').hidden = false;
    document.getElementById('colorcount').hidden = false;
    computeColorsArray(document.getElementById('cp1').jscolor.toHEXString(), document.getElementById('cp2').jscolor.toHEXString());
    document.getElementById('block_0').style.backgroundColor = document.getElementById('cp1').jscolor.toHEXString();


  });

  $('#colorfrom_p').on('click', function() {
    document.getElementById('cp2').hidden = true;
    document.getElementById('cp1').hidden = true;
    document.getElementById('colorcount').hidden = true;
    document.getElementById('block_0').style.backgroundColor = getRandomColor();

  });

  $('#colorfrom_g').prop("checked", true).trigger("click");


//   document.addEventListener("DOMContentLoaded", function() {
//     console.log("HELLO????");
//   var externalScript = document.createElement('script');
//   externalScript.setAttribute('src', 'scripts/jscolor.js');
//   document.head.appendChild(externalScript);
//   externalScript = document.createElement('script');
//   externalScript.setAttribute('src', 'https://unpkg.com/fortmatic@2.0.6/dist/fortmatic.js');
//   document.head.appendChild(externalScript);
// console.log(document.head);
//   externalScript = document.createElement('script');
//   externalScript.setAttribute('src', 'https://unpkg.com/@walletconnect/web3-provider@1.2.1/dist/umd/index.min.js');
//   document.head.appendChild(externalScript);

//   externalScript = document.createElement('script');
//   externalScript.setAttribute('src', 'https://unpkg.com/evm-chains@0.2.0/dist/umd/index.min.js');
//   document.head.appendChild(externalScript);

//   externalScript = document.createElement('script');
//   externalScript.setAttribute('src', 'https://unpkg.com/web3modal@1.9.0/dist/index.js');
//   document.head.appendChild(externalScript);

//   externalScript = document.createElement('script');
//   externalScript.setAttribute('src', 'https://unpkg.com/web3@1.2.11/dist/web3.min.js');
//   document.head.appendChild(externalScript);

//   externalScript = document.createElement('script');
//   externalScript.setAttribute('src', 'https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js');
//   document.head.appendChild(externalScript);

//   externalScript = document.createElement('script');
//   externalScript.setAttribute('src', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js');
//   document.head.appendChild(externalScript);

//   externalScript = document.createElement('script');
//   externalScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.js');
//   document.head.appendChild(externalScript);
//   });