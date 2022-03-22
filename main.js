import './style.css'
import $, { event } from "jquery";
import { ethers } from "ethers";

var borderColor = "white";
var borderWidth = 2;
var outlineOffset = 2;
var clickCount = 0;
var blockIndex = 0;
var blockBuild = new Array();

/*
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
*/

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
}


function randomHsl() {
  return `hsla(${Math.random() * 360}, 100%, 60%, 1)`
}

function divideMeVert(source) {
  var height = parseFloat($(source).css("height"));
  // var width = parseInt($(source).css("width"), 10);
  var new_height = Math.round(height/2);
  // var new_width = width;
  //console.log(new_height.toString()+"px");
  var x = new_height.toString()+"px";
  $(source).animate({height: x}, 500);
  $(source).css("outline", "2px solid white");
  //$(source).css({height: x});
  //$(source).height(x);
}

function addToMeVert(source) {
  var x = parseFloat($(source).css("height"));
  //console.log(x);
  var height = Math.round(x);
  //console.log(height);
  var h = Math.round(height/2).toString()+"px";
  var width = parseFloat($(source).css("width"));
  var w = (width).toString()+"px";
  var position = $(source).position();
  var left = Math.round(position.left);
  console.log("left="+left);
  var top_of_new = parseInt(position.top + height/2)+"px";
  //console.log(top_of_new);
  blockIndex++;
  var bgColor = randomHsl()
  var template = "<div id='block_"+blockIndex+ "' style=' position: absolute; left: "+left+"px; top: "+top_of_new+"; height: "+h+"; width: "+w+"; outline:  "+borderWidth+"px solid "+borderColor+"; outline-offset: -"+outlineOffset+"px; background-color:"+bgColor+"'></div>";// $('#redbox').html();



  // var template = "<div id='block_"+i+ "' style='float: left;  position: relative; height: "+h+"; width: "+w+";  outline: 2px solid white; outline-offset: -2px;background-color:"+randomHsl()+"'></div>";// $('#redbox').html();
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
     divideMeVert(ev.target);
     addToMeVert(ev.target);
    }
    if(ev.type == 'press') {
      console.log(ev.target);
      divideMeVert(ev.target);
      addToMeVert(ev.target);
    }
 });


  // $("#block_"+blockIndex).on('click', function(e) { 
  //   //document.getElementById("instructions").innerText =''
  //   if (e.altKey) {
  //     divideMeLeft(this); 
  //     addToMeLeft(this);
  //     }
  //     if (e.shiftKey) {
  //       divideMeVert(this); 
  //       addToMeVert(this);
  //     }
  //  });
  // //  var s = source.style.backgroundColor
  //  console.log(s);
  //  console.log(source.id);
  //  console.log("#block_"+i);
  //  var d = document.querySelector("#block_"+i)
  //  recordStep( source.id, source.style.backgroundColor, source.style.width, source.style.height,  "#block_"+i, bgColor, w, h, "HORIZONTAL");
  
   recordBlockBuild(document.querySelector("#"+source.id), document.querySelector("#block_"+blockIndex), "HORIZONTAL");
}

function divideMeLeft(source) {
  // var color = $(dest).css("background-color");
  // console.log(color);
  var height = Math.round(parseFloat($(source).css("height")));
  var width = Math.round(parseFloat($(source).css("width")));
  var new_height = height;
  var new_width = Math.round((width) / 2);// + borderWidth;
  var x = new_height.toString()+"px";
  var y = new_width.toString()+"px";
  $(source).animate({width: y}, 500);
  $(source).css("outline", "2px solid white");
  // $(source).css("float", "left");

  //$(dest).width(y);
  // $(dest).css({width: y});
}


function addToMeLeft(source) {
  var width = parseFloat($(source).css("width"));
  var w = (Math.round(width/2)).toString()+"px";
  var height = parseFloat($(source).css("height"));
  var h = height.toString()+"px";
  var position = $(source).position();
  var top = parseInt(position.top);
  var left = parseInt(position.left);
  console.log("top="+top+" left="+left+" right="+parseInt(left+width/2));
  var new_left = left+Math.round(width/2);
  // console.log("new_left="+new_left+" width/2="+width/2);
  blockIndex++;
  // new template we're adding
  var template = "<div id='block_"+blockIndex+ "' style='position: absolute; left: "+new_left+"px; top: "+top+"px; height: "+h+"; width: "+w+"; outline:  "+borderWidth+"px solid "+borderColor+"; outline-offset: -"+outlineOffset+"px; background-color:"+randomHsl()+"'></div>";// $('#redbox').html();

  $(source).after(template);
  const myElement = document.getElementById('block_'+blockIndex);

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
    console.log(ev.target);
    if(ev.type == 'singletap') {
      divideMeLeft(ev.target);
      addToMeLeft(ev.target);
    }
    if(ev.type == 'doubletap') {
     divideMeVert(ev.target);
     addToMeVert(ev.target);
    }
    if(ev.type == 'press') {
      console.log(ev.target);
      divideMeVert(ev.target);
      addToMeVert(ev.target);
    }
 });

  // $("#block_"+blockIndex).on('click', function(e) { 
  //   //document.getElementById("instructions").innerText = ''
  //   if (e.altKey) {
  //     divideMeLeft(this); 
  //     addToMeLeft(this);
  //     }
  //     if (e.shiftKey) {
  //       divideMeVert(this);
  //       addToMeVert(this);
    
  //     }

  // });
  recordBlockBuild(document.querySelector("#"+source.id), document.querySelector("#block_"+blockIndex), "VERTICAL");

}
//Opt/Alt-Click folds Vertically Shit-Click folds Horizontally

document.querySelector('#app').innerHTML = `
<!--div id=connect style='width:100vw; height 10vh;'><button class=button button5; style='margin-bottom: 40px;font-size: 100%;'>CONNECT WALLET</button></div-->
`

// $('#connect').append("<div style='' id=foo>Opt/Alt-Click folds Vertically Shit-Click folds Horizontally</div>");
// $('#foo').append("<div id=top style='width: 90vw; height: 100vh;'></div>");
var initSquareBlock = getViewportSize()+"px";
$('#bottomcontainer').css('width', initSquareBlock);
$('#bottomcontainer').css('height', initSquareBlock);
$('#topcontainer').css('width', initSquareBlock);
$('#topcontainer').css('height', initSquareBlock);
$('#blocks').css('width', initSquareBlock);
$('#blocks').css('height', initSquareBlock);
// console.log(getViewportSize());
// console.log($('#bottomcontainer').css("width"));
// console.log(document.getElementById('bottomcontainer').getBoundingClientRect());
$('#blocks').append("<div id=block_0 style='box-sizing: content-box; height: "+initSquareBlock+"; width: "+initSquareBlock+"; outline:  "+borderWidth+"px solid "+borderColor+"; outline-offset: -"+outlineOffset+"px; background-color:"+randomHsl()+"'></div>");//.on("click", divideMe);

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
   console.log(ev.type);
   if(ev.type == 'singletap') {
     divideMeLeft(ev.target);
     addToMeLeft(ev.target);
   }
   if(ev.type == 'doubletap') {
    divideMeVert(ev.target);
    addToMeVert(ev.target);
   }
   if(ev.type == 'press') {
     console.log(ev.target);
     divideMeVert(ev.target);
     addToMeVert(ev.target);
   }
});
// long-press comes from https://github.com/john-doherty/long-press-event
// $('#block_0').on('long-press', function(e) {
//   divideMeLeft(this);
//   addToMeLeft(this);
// })
$('#top').append("Hello");
recordBlockBuild(null, document.querySelector("#block_0"), "PLACE");

// console.log($('#block_0').width());
// console.log($('#block_0').position().left);
// var left = $('#block_0').position().left;
// var new_left = left+$('#block_0').width()+20;
// console.log(left);
// var top = $('#block_0').position().top-4;
// var x = $('#block_0').height();
// //console.log(top+" "+x);
// var h = top+x+20
//console.log(h);

//$('#block_0').after("<div id=button style='position: absolute; left: "+new_left+"px; top: "+top+"px; font-size: 100%;'><button class=button button5; style='font-size: 100%;'>GET INSTRUCTIONS</button></div>");
// $('#howto').after('<div>TAP/CLICK FOLDS VERTICALLY</div><div>DOUBLE TAP/CLICK FOLDS HORIZONTALLY.</div><div>THERE IS NO UNDO.</div><div>WHEN YOU CLICK \'DONE\' YOU\'LL GET A PDF OF INSTRUCTIONS.</div>')
$('#howto').append('<div style="font-size: 10px" class="p-2">TAP/CLICK FOLDS VERT <br/>DOUBLE TAP/CLICK OR LONG PRESS FOLDS HORIZ. <br/>THERE IS NO UNDO. <br/>WHEN YOU CLICK \'DONE\' YOU\'LL GET A PDF OF INSTRUCTIONS.</div>')
// $('#howto').append('<div class="p-2 text-sm-left">HELLO</div>')

// document.querySelector('#instructions').innerHTML = `<div>DO THIS TO DO THAT. DO THAT TO DO THIS.</div><div>`
$('#instructionbutton').after("<div class=p-3><button id=button class=button button1;>DONE</button></div>");
$('#button').on("click", function(e) {
 unfurlBlockBuild();
});
//$('#instructions').after("<div style='position: absolute; left: "+new_left+"px; top: "+(top+100)+"px; text-align: left; font-size: 9px'></div>")

// document.addEventListener('long-press', function(e) {
//   console.log(e.target);
// });
