


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