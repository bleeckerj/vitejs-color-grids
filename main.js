import './style.css'
import $, { event } from "jquery";

function doSomething(e) {
  e = e || window.event;
  var target = e.target || e.srcElement;
  console.log(target.nodeName)
  var height = target.height;
  
  console.log(target);
  console.log("ID is "+e.target.id);
  //console.log("Did Something");
  $("#" + e.target.id).css("background-color", "green");
  
}

function divideMeVert(dest) {
  var height = parseInt($(dest).css("height"), 10);
  var new_height = height/2;
  console.log(new_height.toString()+"px");
  var x = new_height.toString()+"px";
  $(dest).animate({height: x}, 100);
  console.log(height);
}

function divideMeLeft(dest) {
  // var color = $(dest).css("background-color");
  // console.log(color);
  var height = parseInt($(dest).css("height"), 10);
  var width = parseInt($(dest).css("width"), 10);
  var new_height = height;
  var new_width = width / 2;
  console.log(new_height.toString()+"px");
  var x = new_height.toString()+"px";
  var y = new_width.toString()+"px";
  $(dest).animate({width: y}, 500);
  // $(dest).css({width: y});
  $(dest).css("float", "left");



}
function randomHsl() {
  return `hsla(${Math.random() * 360}, 100%, 60%, 1)`
}
function addToMeLeft(source) {
  console.log($(source).css("width"));
  var width = parseInt($(source).css("width"), 10);
  var w = (width/2).toString()+"px";
  var height = parseInt($(source).css("height"), 10);
  var h = height.toString()+"px";
  var position = $(source).position();
  var top = parseInt(position.top);
  var left = parseInt(position.left);
  console.log("top="+top+" left="+left+" right="+parseInt(left+width/2));
  console.log("height="+height);
  i++;
  // left: "+parseInt(width/2)+"px;
  // new template we're adding
  var template = "<div id='name_"+i+ "' style='float: left; position: relative; height: "+h+"; width: "+w+"; outline: 2px solid white; outline-offset: -2px;background-color:"+randomHsl()+"'></div>";// $('#redbox').html();
  $(source).after(template);

  $("#name_"+i).on('click', function() { divideMeLeft(this); addToMeLeft(this); /*$(this).css("background-color", "red");*/ });
  $(source).css("width",w);
  // $(source).css({"left" : parseInt(left+width/2)});
  
}

function addToMe(dest) {
  console.log($(dest).css("height"));
  var height = parseInt($(dest).css("height"), 10);
  var x = (height/2).toString()+"px";
  var width = parseInt($(dest).css("width"), 10);
  var y = (width).toString()+"px";
  i++;
  var template = "<div id='name_"+i+ "' style='float: left;  position: relative; height: "+x+"; width: "+y+";  outline: 2px solid white; outline-offset: -2px;background-color:blue'></div>";// $('#redbox').html();
  $(dest).after(template);
  $("#name_"+i).on('click', function() { divideMeLeft(this); addToMe(this); /*$(this).css("background-color", "red");*/ });
}
var i = 1;

document.querySelector('#app').innerHTML = `
  
`
$('#app').append("<div style='width: 100vh; height: 100vh;' id=top></div>")
$('#top').append("<div id=first style='height: 100vh; width: 100hh; outline: 2px solid white; outline-offset: -2px; background-color:"+randomHsl()+"'></div>");//.on("click", divideMe);
$('#first')
.on("click", function() {
  divideMeLeft(this); addToMeLeft(this);
  // var template = "<div id='name_"+i+ "' style='position: relative; height: 25vh; width: 100%; background-color:blue'></div>";// $('#redbox').html();
  // //console.log(template);
  // // console.log(this.lastChild)
  // //if (this.lastChild === null) {
  //   $("#top").after(template);
  //   var myHeight = parseInt($(this).css("height"), 10);
  //   var newHeight = myHeight/2;
  //   var x = newHeight.toString()+"px";
  //   $(this).animate({height: x}, 500);
  //   $("#yellow").animate({height: x}, 500);
  //   $("#name_"+i).on('click', function() { divideMe(this); appendToMe(this); /*$(this).css("background-color", "red");*/ });

  //} else {
    // console.log(this.lastChild);
    //console.log("Hello");
    //this.lastChildElement.append("<div style='display: inline-block; position: relative; top: 50%; height: 50%; width: 100%; background-color:blue'>Another</div>");
 // }

  i++;
  //$("#redbox").append(template);
//  console.log( event );
//  this.append("<div style='background-color:red'></div>");
})
// $('#inner').on("click", function(){
//   console.log( $( this ).text() );
// });