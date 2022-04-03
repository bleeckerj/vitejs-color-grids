import './style.css'
//import CID from "ipfs-http-client";

import $, { event } from "jquery";
import { ethers } from "ethers";
import { randomColor } from "randomcolor";
import chroma from "chroma-js";
import domtoimage from 'dom-to-image';
import ColorScheme from 'color-scheme';
import { jsPDF } from "jspdf";
import "./scripts/jscolor.js";
import { fromString } from 'uint8arrays/from-string'
import thePalettesJson from './palettes/palettesJson.json'
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
//console.log(colors)


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
var colorsFromCuratedPalette;
initRandomCuratedColorPalette();
function initRandomCuratedColorPalette() {
  var colorPaletteIndex = Math.round(Math.random()*thePalettesJson.palettes.length-1);
  colorsFromCuratedPalette = thePalettesJson.palettes[colorPaletteIndex].rgb.split('-').map(color => 
  '#' + color
  );
  console.log(colorsFromCuratedPalette);
}

function computeColorsArray(start = '#fafa6e', end = '#41D067') {
  //var scheme = new ColorScheme;
  //console.log(scheme);
  //scheme.from_hue((Math.random() * 360)).scheme('tetrade').variation('default');
  //var colors; = scheme.colors();
  //console.log(chroma.scale(['#fafa6e','#2A4858'])(0.5).hsl());
//colors = chroma.scale(['#fafa6e', '#fafa6e']).mode('lch').colors(6); // start and finish
  var colorCount = parseInt($('#colorcount').val());
  colors = chroma.scale([start, end]).colors(colorCount+1);//colors = ['ff0000', '00ff00', '0000ff'];
  if (colorCount == 1) {
    colors = [start];
  }
  console.log(colors);
}

function randomHsl() {
  //var r = `hsla(${Math.random() * 360}, 100%, 60%, 1)`;
  var index = colorIndex % colors.length

  //index = colorIndex % rndColorsFromPalette.length;

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
  index = colorIndex % colorsFromCuratedPalette.length;
  var paletteHexColor = colorsFromCuratedPalette[index];
  console.log(paletteHexColor);
  return paletteHexColor;
}

function getGradientPalettes() {
  colorsFromCuratedPalette = getObjects(thePalettesJson, 'method', 'gradients');
  console.log(colorsFromCuratedPalette);
}

function getObjects(obj, key, val) {
  var objects = [];
  for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] == 'object') {
          objects = objects.concat(getObjects(obj[i], key, val));
      } else if (i == key && obj[key] == val) {
          objects.push(obj);
      }
  }
  return objects;
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
  // console.log($("input[name=colorfrom]:checked").val());
  var whichType = $("input[name=colorfrom]:checked").val();
console.log(whichType);
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
  // remove everything under block_0
  blockBuild = new Array();
  document.getElementById("instructions").innerText = '' 
  var parent = document.querySelector('#block_0');
  parent.style.height = initSquareBlockHeight;
  parent.style.width = initSquareBlockWidth;
  // parent.style.top = top;
  // parent.style.left = left;
  recordBlockBuild(null, document.querySelector("#block_0"), "PLACE");
  console.log(parent);
  while (parent.nextSibling) {
    parent.nextSibling.remove();
  }
  initRandomCuratedColorPalette()
}

function clear() {
  var parent = document.querySelector('#block_0');
  parent.style.height = initSquareBlockHeight;
  parent.style.width = initSquareBlockWidth;
  // parent.style.top = top;
  // parent.style.left = left;
  while (parent.nextSibling) {
    parent.nextSibling.remove();
  }
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
  // console.log("source.position="+$(source).position());
  // console.log("source.height="+$(source).height());
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
  // mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
  // Single tap recognizer
  mc.add( new Hammer.Tap({ event: 'singletap' }) );
  mc.add( new Hammer.Press({ event: 'press', time: 800 }) );
  //mc.add( new Hammer.Press({ event: 'pressup', time: 1200 }));
  mc.add(new Hammer.Swipe({ event: 'swipe' })).set({ direction: Hammer.DIRECTION_ALL });
  //mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

  // mc.on("swipeleft", function () { 
  //   alert('swipeleft');
  // }); 
      
  //      mc.on("swiperight", function () { 
  //   alert('swiperight');
  // });
  
  // mc.on("swipeup", function () { 
  //   alert('swipeup');
  // }); 
  
  // mc.on("swipedown", function () { 
  //   alert('swipedown');
  // });
  // Hammer(myElement).on("swiperight", function() {
  //   console.log("swiperight");
  // });
  // Hammer(myElement).on("swipeleft", function() {
  //   console.log("swipeleft");
  // });
  // Hammer(myElement).on("swipeup", function() {
  //   console.log("dragleft");
  // });
  // Hammer(myElement).on("swipedown", function() {
  //   console.log("dragright");
  // }); 
  // we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
  //mc.get('doubletap').recognizeWith('singletap');
  // we only want to trigger a tap, when we don't have detected a doubletap
  //mc.get('singletap').requireFailure('doubletap');
  mc.on("singletap press pressup swipeleft swiperight swipeup swipedown", function(ev) {
    document.getElementById("instructions").innerText = ''
    console.log(ev.type);
    if(ev.type == 'swipeleft') {
      colorIndex++;
      document.querySelector("#"+ev.target.id).style.backgroundColor = getRandomColor();
    }
    if(ev.type == 'swiperight') {
      console.log('swiperight');
    }
    if(ev.type == 'swipeup') {
      console.log('swipeup');
    }
    if(ev.type == 'swipedown') {
      console.log('swipedown');
    }
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
  mc.add( new Hammer.Swipe({ event: 'swipe' }))

  // we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
  // mc.get('doubletap').recognizeWith('singletap');
  // // we only want to trigger a tap, when we don't have detected a doubletap
  // mc.get('singletap').requireFailure('doubletap');

  mc.on("singletap press swipeleft swiperight swipeup swipedown", function(ev) {
    document.getElementById("instructions").innerText = ''
    // console.log(ev.type);
    // console.log(ev.target);
    if(ev.type == 'swipeleft') {
      colorIndex++;
      document.querySelector("#"+ev.target.id).style.backgroundColor = getRandomColor();
    }
    if(ev.type == 'swiperight') {
      console.log('swiperight');
    }
    if(ev.type == 'swipeup') {
      console.log('swipeup');
    }
    if(ev.type == 'swipedown') {
      console.log('swipedown');
    }
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
function resizeResetClear() {


}
const width  = window.innerWidth || document.documentElement.clientWidth || 
document.body.clientWidth;
const height = window.innerHeight|| document.documentElement.clientHeight|| 
document.body.clientHeight;

console.log(width, height);
console.log(globalThis.screen.availWidth)
console.log(globalThis.screen.availHeight)

var initSquareBlockWidth = "400px" //width+"px";//getViewportSize()+"px";
var initSquareBlockHeight = "600px"//(width*16/9)+"px";
$('#bottomcontainer').css('width', "800px");
$('#bottomcontainer').css('height', "800px");
$('#topcontainer').css('width', "800px");
$('#topcontainer').css('height', "800px");
// $('#blocks').css('width', initSquareBlockWidth);
// $('#blocks').css('height', initSquareBlockHeight);

// var top = 0;//$('#blocks').offset().top;
// var left = 0;//0; //$('#blocks').offset().left;

// $('#blocks').append("<div id=block_0 style='position: relative; top: "+top+"px; left: "+left+"; height: "+initSquareBlockHeight+"; width: "+initSquareBlockWidth+"; outline:  "+borderWidth/2+"px solid "+borderColor+"; outline-offset: -"+outlineOffset/2+"px; background-color:"+getRandomColor()+"'></div>");//.on("click", divideMe);
$('#blocks').append("<div id=block_0 style='position: absolute; width: "+initSquareBlockWidth+"; height: "+initSquareBlockHeight+"; outline:  "+borderWidth/2+"px solid "+borderColor+"; outline-offset: -"+outlineOffset/2+"px; background-color:"+getRandomColor()+"'></div>");//.on("click", divideMe);

var myElement = document.getElementById('block_0');

// We create a manager object, which is the same as Hammer(), but without the presetted recognizers. 
var mc = new Hammer.Manager(myElement);
// mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
// Single tap recognizer
mc.add( new Hammer.Tap({ event: 'singletap' }) );
mc.add( new Hammer.Press({ event: 'press', time: 800 }) );
mc.add( new Hammer.Swipe({ event: 'swipe' }))
// we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
// mc.get('doubletap').recognizeWith('singletap');
// we only want to trigger a tap, when we don't have detected a doubletap
// mc.get('singletap').requireFailure('doubletap');
// single to the left
// double vert
mc.on("singletap press swipeleft swiperight swipeup swipedown", function(ev) {
  document.getElementById("instructions").innerText = ''
  if(ev.type == 'swipeleft') {
    colorIndex++;
    document.getElementById('block_0').style.backgroundColor = getRandomColor();
  }
  if(ev.type == 'swiperight') {
    console.log('swiperight');
  }
  if(ev.type == 'swipeup') {
    console.log('swipeup');
  }
  if(ev.type == 'swipedown') {
    console.log('swipedown');
  }
   
   if(ev.type == 'singletap') {
     divideMeLeft(ev.target);
     addToMeLeft(ev.target);
   }
   if(ev.type == 'press') {
    var orientation = divideMeHorizontal(ev, 0.25);
    recordBlockBuild(document.querySelector("#"+ev.target.id), document.querySelector("#block_"+blockIndex), "HORIZONTAL", orientation);
   }
});

$('#top').append("Hello");
recordBlockBuild(null, document.querySelector("#block_0"), "PLACE");

$('#instructions').append('<div style="font-size: 10px" class="p-2">TAP/CLICK FOLDS VERT <br/>LONG PRESS FOLDS HORIZ. <br/>THERE IS NO UNDO. <br/>WHEN YOU CLICK \'DONE\' YOU\'LL GET YOUR ART AND A PDF OF INSTRUCTIONS.</div>')

// document.querySelector('#instructions').innerHTML = `<div>DO THIS TO DO THAT. DO THAT TO DO THIS.</div><div>`
$('#instructionbutton').after("<button id='donebutton' class='button1 button;'>DONE</button>");
$('#donebutton').on("click", function(e) {
 var instrText = unfurlBlockBuild();

//var node = document.getElementById('blocks');
//console.log(node);
var blocksCurrentRect = document.getElementById('blocks').getBoundingClientRect();

document.getElementById('blocks').style.left = '0px';
console.log(document.getElementById('blocks'));
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
      document.getElementById('blocks').style.left = blocksCurrentRect.left+"px";

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
        doc.save("instructions.pdf");

        var link = document.createElement('a');
        link.download = 'LeWittttttttt.jpeg';
        link.href = dataUrl;
        link.click();

    });
    console.log("DONE!");

}); // button on click

$('#walletbutton').after("<button id='wallet' class='button1 button;'>WALLET</button>");

$('#wallet').on("click", async function(e) {
  alert("Wallet");
  // /*
  const provider = new ethers.providers.Web3Provider(
    window.ethereum,
    "any"
  );
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  (async function () {
    let userAddress = await signer.getAddress();
    document.getElementById("wallet").innerText =
      "Your wallet is " + userAddress;
      
  })();
});

$('#clearbutton').after("<button id='fruitflavor' class='button1 button;'>FRUIT FLAVOR</button> <button id='clear' class='button1 button;'>NEW PASTRY</button>");
$('#clear').on("click", function(e) {
  clearAndRestart();
});

$('#fruitflavor').on("click", function(e) {
  resetFruitFlavorsPalette();
  //   initRandomCuratedColorPalette();
  //   clear();
  //   document.getElementById('block_0').style.backgroundColor = getRandomColor();
  //   $('#flavors').empty();
  //   while ($('#flavors').firstChild) {
  //     $('#flavors').removeChild($('#flavors').firstChild);
  // }
  //   var palette = colorsFromCuratedPalette
    
  //   // console.log(palette);
  //   palette.forEach((element) => {
  //     $('#flavors').append('<div style="float : left; width: 30px; height: 20px; background-color : '+ element+';"></div>');
  //   })
    
  });

  function resetFruitFlavorsPalette() {
    colorIndex = 0;
    initRandomCuratedColorPalette();
    clear();
    document.getElementById('block_0').style.backgroundColor = getRandomColor();
    $('#flavors').empty();
    while ($('#flavors').firstChild) {
      $('#flavors').removeChild($('#flavors').firstChild);
  }
    var palette = colorsFromCuratedPalette
    
    // console.log(palette);
    palette.forEach((element) => {
      $('#flavors').append('<div style="float : left; width: 30px; height: 20px; background-color : '+ element+';"></div>');
    })
  }
//
// If the pickers change or the count change, update the color range
//
  var picker_1 = new JSColor('#cp1');
  //picker_1.presets.default = {sliderSize:20, shadow:false};
  document.getElementById('cp1').jscolor.onChange = function() {
    computeColorsArray(this.toHEXString(),document.getElementById('cp2').jscolor.toHEXString() );
    document.getElementById('block_0').style.backgroundColor = this.toHEXString();
  }
  picker_1.fromString(colors[0]);

  var picker_2 = new JSColor('#cp2');
  //picker_2.presets.default = {sliderSize:20, shadow:false};
  //document.getElementById('cp2').jscolor.show();
  document.getElementById('cp2').jscolor.onChange = function() {
    computeColorsArray(document.getElementById('cp1').jscolor.toHEXString(),this.toHEXString() );
  }
  picker_2.fromString(colors[colors.length-1]);

  $(document).on('change','#colorcount' ,function(){
    computeColorsArray(document.getElementById('cp1').jscolor.toHEXString(), document.getElementById('cp2').jscolor.toHEXString());
  });

  $('#colorfrom_g').on('click', function() {
    // document.getElementById('cp2').disabled = false;
    // document.getElementById('cp1').disabled = false;
    // document.getElementById('colorcount').disabled = false;
    // document.getElementById('qc').disabled = false;
    // document.getElementById('fruitflavor').disabled = true;
    computeColorsArray(document.getElementById('cp1').jscolor.toHEXString(), document.getElementById('cp2').jscolor.toHEXString());
    document.getElementById('block_0').style.backgroundColor = document.getElementById('cp1').jscolor.toHEXString();
    clearAndRestart();
    // //document.getElementById('clear').disabled = true;
  });

  $('#colorfrom_p').on('click', function() {
    console.log("HELLO");
    // document.getElementById('cp2').disabled = true;// hidden = true;
    // document.getElementById('cp1').disabled = true;
    // document.getElementById('colorcount').disabled = true;
    // document.getElementById('qc').disabled = true;

    document.getElementById('block_0').style.backgroundColor = getRandomColor();
    document.getElementById('fruitflavor').disabled = false;
    //document.getElementById('clear').disabled = false;

    resetFruitFlavorsPalette();
  });


  //$('#colorfrom_g').prop("checked", true).trigger("click");