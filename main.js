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

function randomHsl() {
  return `hsla(${Math.random() * 360}, 100%, 60%, 1)`
}

function divideMeVert(source) {
  var height = parseInt($(source).css("height"), 10);
  // var width = parseInt($(source).css("width"), 10);
  var new_height = height/2;
  // var new_width = width;
  console.log(new_height.toString()+"px");
  var x = new_height.toString()+"px";
  $(source).animate({height: x}, 500);
  //$(source).css({height: x});
  //$(source).height(x);
}

function addToMeVert(source) {
  console.log($(source).css("height"));
  var height = parseInt($(source).css("height"), 10);
  var h = (height/2).toString()+"px";
  var width = parseInt($(source).css("width"), 10);
  var w = (width).toString()+"px";
  var position = $(source).position();
  console.log("left="+position.left+" top="+position.top);
  var top_of_new = parseInt(position.top + height/2)+"px";
  console.log(top_of_new);
  i++;
  var template = "<div id='name_"+i+ "' style=' position: absolute; left: "+position.left+"px; top: "+top_of_new+"; height: "+h+"; width: "+w+";  outline: 4px solid white; outline-offset: -2px;background-color:"+randomHsl()+"'></div>";// $('#redbox').html();

  // var template = "<div id='name_"+i+ "' style='float: left;  position: relative; height: "+h+"; width: "+w+";  outline: 2px solid white; outline-offset: -2px;background-color:"+randomHsl()+"'></div>";// $('#redbox').html();
  $(source).after(template);
  $("#name_"+i).on('click', function(e) { 
    if (e.altKey) {
      divideMeLeft(this); 
      addToMeLeft(this);
      }
      if (e.shiftKey) {
        divideMeVert(this); 
        addToMeVert(this);
      }
   });
}

function divideMeLeft(source) {
  // var color = $(dest).css("background-color");
  // console.log(color);
  var height = parseInt($(source).css("height"), 10);
  var width = parseInt($(source).css("width"), 10);
  var new_height = height;
  var new_width = width / 2;
  console.log(new_height.toString()+"px");
  var x = new_height.toString()+"px";
  var y = new_width.toString()+"px";
  $(source).animate({width: y}, 500);
  // $(source).css("float", "left");

  //$(dest).width(y);
  // $(dest).css({width: y});
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
  var new_left = left+width/2;
  console.log("new_left="+new_left+" width/2="+width/2);
  i++;
  // new template we're adding
  var template = "<div id='name_"+i+ "' style='position: absolute; left: "+new_left+"px; top: "+top+"px; height: "+h+"; width: "+w+"; outline: 4px solid white; outline-offset: -2px;background-color:"+randomHsl()+"'></div>";// $('#redbox').html();

  $(source).after(template);

  $("#name_"+i).on('click', function(e) { 
    if (e.altKey) {
      divideMeLeft(this); 
      addToMeLeft(this);
      }
      if (e.shiftKey) {
        divideMeVert(this);
        addToMeVert(this);
    
      }
  });
  $(source).css("width",w);  
}

var i = 1;

document.querySelector('#app').innerHTML = `

`
$('#app').append("<div style='width: 100vh; height: 100vh;' id=top></div>")
$('#top').append("<div id=first style='height: 90vh; width: 90vh;  background-color:"+randomHsl()+"'></div>");//.on("click", divideMe);
$('#first')
.on("click", function(e) {
  if (e.altKey) {
  divideMeLeft(this); 
  addToMeLeft(this);
  }
  if (e.shiftKey) {
    divideMeVert(this); 
    addToMeVert(this);

  }
  i++;

})
