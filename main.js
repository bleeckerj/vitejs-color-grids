import './style.css'
import $, { event } from "jquery";
import { ethers } from "ethers";
import { randomColor } from "randomcolor";
import chroma from "chroma-js";
import domtoimage from 'dom-to-image';
import ColorScheme from 'color-scheme';
import { jsPDF } from "jspdf";

var borderColor = "black";
var borderWidth = 2;
var outlineOffset = 2;
var clickCount = 0;
var blockIndex = 0;
var blockBuild = new Array();

var scheme = new ColorScheme;
console.log(scheme);
scheme.from_hue((Math.random() * 360)).scheme('tetrade').variation('default');
var colors = scheme.colors();
console.log(colors);
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


function getViewport () {
  // https://stackoverflow.com/a/8876069
  const width = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  if (width <= 576) return 'xs'
  if (width <= 768) return 'sm'
  if (width <= 992) return 'md'
  if (width <= 1200) return 'lg'
  return 'xl'
}

function getViewportSize() {
  const width = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  const height = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  )
  if (width > height) {
    return Math.round(height*0.75);
  } else {
    return Math.round(width*0.75);
  }
  
}

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

function recordBlockBuild(sourceDiv, siblingDiv, direction) {
  if(sourceDiv != null) {
  var name_0 = sourceDiv.id;
  var width_0 = sourceDiv.clientWidth;
  var height_0 = sourceDiv.clientHeight;
  var bgColor_0 = $("#"+sourceDiv.id).css("background-color");

  var name_1 = siblingDiv.id;
  var width_1 = siblingDiv.clientWidth;
  var height_1 = siblingDiv.clientHeight;
  var bgColor_1 = $("#"+siblingDiv.id).css("background-color");

  blockBuild.push([name_0, width_0, height_0, bgColor_0, name_1, width_1, height_1, bgColor_1, direction]);
  } else {
  var name_1 = siblingDiv.id;
  var width_1 = siblingDiv.clientWidth;
  var height_1 = siblingDiv.clientHeight;
  var bgColor_1 = $("#"+siblingDiv.id).css("background-color");

  blockBuild.push([null, null, null, null, name_1, width_1, height_1, bgColor_1, direction]);
  }
  // console.log(direction);
  // blockBuild.push([sourceDiv, siblingDiv, direction]);
  // console.log(blockBuild);
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
    //console.log(bgColor_0);

    var name_1 = element[4];
    var width_1 = element[5];
    var height_1 = element[6];
    var ratio_1 = getLowestFraction(width_1/height_1);
    var bgColor_1 = element[7];
    var direction = element[8];
    text += stepNumber+". "
    if (direction != "PLACE") {
      if (direction == "HORIZONTAL") {
        text += "Divide the block referred to as '"+name_0+"' along the "+direction+" axis, making its width now "+width_0+" units and height now "+height_1+" units (a size ratio of "+ratio_1+").";
        text += "\r\nAdd a new block below '"+name_0+"' with a width of "+width_1+" units and a height of "+height_1+" units (a size ratio of "+ratio_1+").";
        
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
  console.log(text);
  document.getElementById("instructions").innerText = text;

  return text;
}


function randomHsl() {
  var r = `hsla(${Math.random() * 360}, 100%, 60%, 1)`;
  var index = blockIndex % colors.length
  console.log(index);
  var h = chroma(colors[index]).hsl();
  console.log(`hsla(`+h[0]+`,`+h[1]+`,`+h[2]+`,`+h[3]+`)`);
  var c = `hsla(`+h[0]+`,`+h[1]*100+`%,`+h[2]*100+`%,`+h[3]+`)`;

  //var r = randomColor({luminosity: 'bright', format: 'hsla', alpha: 1.0 });
  //console.log(r);
  //console.log(r);
  //return colors[blockIndex];
  return c;
}

function getRandomColor() {
  // let rgb =  randomColor({ luminosity: 'light', format: 'hsla' });
  // console.log(rgb);
  // // let c = randomHsl();
  // // console.log(c);
  // console.log(randomHsl());
  // return randomColor({ hue: 'light', format: 'hsla' });
  return randomHsl();
}

function divideMeHorizontal(event, factor=0.25) {
  var source = event.target;
  var divFactor = getDivisionFactor(source, event);
  console.log("qH="+divFactor.qH);
  
  var oldHeight = Math.round(parseFloat($(source).css("height")));
  var newHeight = Math.round((0.5)*oldHeight); // default to 50%
  // bottom so the existing block is going to be 1-factor * height

  if (divFactor.qH >= (1-factor)) {
    newHeight = Math.round((1-factor)*oldHeight);
  }
  if (divFactor.qH <= factor) {
    newHeight = Math.round(factor*oldHeight);
  }
  console.log("newHeight="+newHeight)
  var newHeightStr = newHeight.toString()+"px";
  $(source).animate({height: newHeightStr}, 500);
  //$(source).height(newHeight);
  //$(source).css("outline", "2px solid white");
}

function addToMeHorizontal(event, factor=0.25) {
  var source = event.target;
  var divFactor = getDivisionFactor(source, event);
  console.log("qH="+divFactor.qH);
  var sourcePosition = $(source).position();

  var sourceHeight = Math.round(parseFloat($(source).css("height")));
  console.log("sourceHeight="+sourceHeight);

  //var oldHeight = Math.round(sourceHeight);
  //console.log(height);
  var top = parseInt(sourcePosition.top);
  
  var newHeight = Math.round((0.5)*sourceHeight);
  var top = Math.round(sourcePosition.top + sourceHeight/2); // default divide in half

  if (divFactor.qH >= (1-factor)) {
    newHeight = Math.round((factor)*sourceHeight);
    top = Math.round(sourcePosition.top + (1-factor)*sourceHeight)
  }
  if (divFactor.qH <= factor) {
    newHeight = Math.round((1-factor)*sourceHeight);
    top = Math.round(sourcePosition.top + factor*sourceHeight)
    console.log("newHeight="+newHeight+", top="+top);
  }  
  var newHeightStr = newHeight.toString()+"px";
  var topStr = top.toString()+"px";

  var width = Math.round(parseFloat($(source).css("width")));
  var widthStr = (width).toString()+"px";

  var position = $(source).position();
  var left = Math.round(position.left);
  blockIndex++;
  var bgColor = getRandomColor();
  var template = "<div id='block_"+blockIndex+ "' style=' position: absolute; left: "+left+"px; top: "+topStr+"; height: "+newHeightStr+"; width: "+widthStr+"; outline:  "+borderWidth/2+"px solid "+borderColor+"; outline-offset: -"+outlineOffset/2+"px; background-color:"+bgColor+"'></div>";

  $(source).after(template);
  var myElement = document.getElementById('block_'+blockIndex);

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
    console.log(ev.type);
    if(ev.type == 'singletap') {
      divideMeLeft(ev.target);
      addToMeLeft(ev.target);
    }
    if(ev.type == 'doubletap') {
     divideMeHorizontal(ev.target);
     addToMeHorizontal(ev.target);
    }
    if(ev.type == 'press') {
      console.log(ev.target);
      divideMeHorizontal(ev.target);
      addToMeHorizontal(ev.target);
    }
 });
   recordBlockBuild(document.querySelector("#"+source.id), document.querySelector("#block_"+blockIndex), "HORIZONTAL");
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
    }
    if(ev.type == 'doubletap') {
     divideMeHorizontal(ev.target);
     addToMeHorizontal(ev.target);
    }
    if(ev.type == 'press') {
      console.log(ev.target);
      divideMeHorizontal(ev.target);
      addToMeHorizontal(ev.target);
    }
 });

  recordBlockBuild(document.querySelector("#"+source.id), document.querySelector("#block_"+blockIndex), "VERTICAL");

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
  console.log("qH="+qH+" qV="+qV);
  return {qH: qH, qV: qV};
}

//Opt/Alt-Click folds Vertically Shit-Click folds Horizontally

document.querySelector('#app').innerHTML = `
<!--div id=connect style='width:100vw; height 10vh;'><button class=button button5; style='margin-bottom: 40px;font-size: 100%;'>CONNECT WALLET</button></div-->
`

// $('#connect').append("<div style='' id=foo>Opt/Alt-Click folds Vertically Shit-Click folds Horizontally</div>");
// $('#foo').append("<div id=top style='width: 90vw; height: 100vh;'></div>");
var initSquareBlock = "600px";//getViewportSize()+"px";
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
mc.on("singletap doubletap press", function(ev) {
  document.getElementById("instructions").innerText = ''
  // var rect = ev.target.getBoundingClientRect();
  // console.log(ev.center.x +", "+ev.center.y);
  // var x = ev.center.x - rect.left; //x position within the element.
  // var y = ev.center.y - rect.top;  //y position within the element.
  // console.log("From Left? : " + x + " ; From Top? : " + y + ".");
  // console.log("Height "+rect.height);
  // var qH = y / rect.height;
  // console.log("qH="+qH);

   if(ev.type == 'singletap') {
     divideMeLeft(ev.target);
     addToMeLeft(ev.target);
   }
   if(ev.type == 'doubletap') {
    divideMeHorizontal(ev.target);
    addToMeHorizontal(ev.target);
   }
   if(ev.type == 'press') {
     console.log(ev.target);
     divideMeHorizontal(ev);
     addToMeHorizontal(ev);
   }
});
// long-press comes from https://github.com/john-doherty/long-press-event
// $('#block_0').on('long-press', function(e) {
//   divideMeLeft(this);
//   addToMeLeft(this);
// })
$('#top').append("Hello");
recordBlockBuild(null, document.querySelector("#block_0"), "PLACE");

$('#howto').append('<div style="font-size: 10px" class="p-2">TAP/CLICK FOLDS VERT <br/>DOUBLE TAP/CLICK OR LONG PRESS FOLDS HORIZ. <br/>THERE IS NO UNDO. <br/>WHEN YOU CLICK \'DONE\' YOU\'LL GET YOUR ART AND A PDF OF INSTRUCTIONS.</div>')

// document.querySelector('#instructions').innerHTML = `<div>DO THIS TO DO THAT. DO THAT TO DO THIS.</div><div>`
$('#instructionbutton').after("<div class=p-3><button id=button class=button button1;>DONE</button></div>");
$('#button').on("click", function(e) {
 var instrText = unfurlBlockBuild();

var node = document.getElementById('blocks');
console.log(node);
var img;
domtoimage.toJpeg(document.getElementById('blocks'), { quality: 0.95 })
    .then(function (dataUrl) {
        img = dataUrl;
        console.log(img);

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
        link.download = 'lewitt.jpeg';
        link.href = dataUrl;
        link.click();
    });
}); // button on click
$('#walletbutton').after("<div class=p-3><button id=button class=button button1;>CONNECT WALLET</button></div>");
$('#walletbutton').on("click", function(e) {})