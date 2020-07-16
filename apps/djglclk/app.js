var pal;
var img1;
var img1height;
var img2;
var img2height;
var currentCycle;
var cycleAfternoon = [
  { reverse: 0, rate: 0, low: 167, high: 174 },
  { reverse: 0, rate: 1536, low: 135, high: 143 },
  { reverse: 0, rate: 1380, low: 127, high: 134 },
  { reverse: 0, rate: 2304, low: 119, high: 126 },
  { reverse: 0, rate: 1536, low: 217, high: 223 },
  { reverse: 0, rate: 2841, low: 210, high: 216 },
  { reverse: 0, rate: 2841, low: 203, high: 209 },
  { reverse: 0, rate: 2841, low: 196, high: 202 },
  { reverse: 0, rate: 2841, low: 189, high: 195 },
  { reverse: 0, rate: 2841, low: 182, high: 188 },
  { reverse: 0, rate: 2841, low: 175, high: 181 },
  { reverse: 0, rate: 0, low: 0, high: 0 },
  { reverse: 0, rate: 0, low: 0, high: 0 },
  { reverse: 0, rate: 0, low: 0, high: 0 },
  { reverse: 0, rate: 0, low: 0, high: 0 }
];
var cycleNight = [
  { reverse: 0, rate: 0, low: 0, high: 0 },
  { reverse: 0, rate: 1227, low: 150, high: 155 },
  { reverse: 0, rate: 1536, low: 135, high: 143 },
  { reverse: 0, rate: 1380, low: 127, high: 134 },
  { reverse: 0, rate: 2304, low: 119, high: 126 },
  { reverse: 0, rate: 1536, low: 217, high: 223 },
  { reverse: 0, rate: 2841, low: 210, high: 216 },
  { reverse: 0, rate: 2841, low: 203, high: 209 },
  { reverse: 0, rate: 2841, low: 196, high: 202 },
  { reverse: 0, rate: 2841, low: 189, high: 195 },
  { reverse: 0, rate: 2841, low: 182, high: 188 },
  { reverse: 0, rate: 2841, low: 175, high: 181 },
  { reverse: 0, rate: 1227, low: 160, high: 164 },
  { reverse: 0, rate: 3300, low: 165, high: 169 },
  { reverse: 0, rate: 2994, low: 170, high: 174 },
  { reverse: 0, rate: 1227, low: 156, high: 159 }
];
var cycleMorning = [
  { reverse: 0, rate: 0, low: 0, high: 0 },
  { reverse: 0, rate: 0, low: 0, high: 0 },
  { reverse: 0, rate: 0, low: 0, high: 0 },
  { reverse: 0, rate: 0, low: 0, high: 0 },
  { reverse: 0, rate: 0, low: 167, high: 174 },
  { reverse: 0, rate: 1536, low: 135, high: 143 },
  { reverse: 0, rate: 1380, low: 127, high: 134 },
  { reverse: 0, rate: 2304, low: 119, high: 126 },
  { reverse: 0, rate: 1536, low: 217, high: 223 },
  { reverse: 0, rate: 2841, low: 210, high: 216 },
  { reverse: 0, rate: 2841, low: 203, high: 209 },
  { reverse: 0, rate: 2841, low: 196, high: 202 },
  { reverse: 0, rate: 2841, low: 189, high: 195 },
  { reverse: 0, rate: 2841, low: 182, high: 188 },
  { reverse: 0, rate: 2841, low: 175, high: 181 }
];
var is12Hour = (require("Storage").readJSON("setting.json",1)||{})["12hour"];
var IX = 80, IY = 10, IBPP = 1;
var IW = 174, IH = 45, OY = 24;
var inf = {align:0};
var bgoptions;

require("Font7x11Numeric7Seg").add(Graphics);
var cg = Graphics.createArrayBuffer(IW,IH,IBPP,{msb:true});
var cgimg = {width:IW,height:IH,bpp:IBPP,transparent:0,buffer:cg.buffer};
var locale = require("locale");
var lastTime = "";

function drawClock(t) {
  var hours = t.getHours();
  var meridian = "";
  if (is12Hour) {
    meridian = (hours < 12) ? "AM" : "PM";
    hours = ((hours + 11) % 12) + 1;
  }
  // draw time
  cg.clear(1);
  cg.setColor(1);
  var x = 74 + 32 * inf.align;
  cg.setFont("7x11Numeric7Seg",3);
  cg.setFontAlign(1,-1);
  cg.drawString(hours, x, 0);
  x+=2;
  if (t.getSeconds() & 1)
    cg.fillRect(x, 10, x+2, 10+2).fillRect(x, 20, x+2, 20+2);
  x+=6;
  cg.setFontAlign(-1,-1);
  cg.drawString(("0"+t.getMinutes()).substr(-2), x, 0);
  x+=44;
  cg.setFont("7x11Numeric7Seg",1);
  cg.drawString(("0"+t.getSeconds()).substr(-2), x, 20);
  cg.setFont("6x8",1);
  cg.drawString(meridian, x+2, 0);
  let date = locale.date(t);
  if (cg.stringWidth(date) < IW-64) {
    cg.setFontAlign(0, -1);
    cg.drawString(date,IW/2+32*inf.align,IH-8);
  } else {
    cg.setFontAlign(inf.align, -1);
    cg.drawString(date,IW*(inf.align+1)/2,IH-8);
  }
}

function draw() {
  var cd = new Date()
  var h = cd.getHours();
  var t = cd.toString();
  if (t!=lastTime) {
    lastTime = t;
    if(h < 6 || h > 20){
      img1 = require("Storage").read("night.pixels1");
      img2 = require("Storage").read("night.pixels2");
      pal = new Uint16Array(E.toArrayBuffer(E.toString(require("Storage").read("night.pal"))));
      currentCycle = cycleNight;
    }else if(h>=6 && h<=13){
      img1 = require("Storage").read("morning.pixels1");
      img2 = require("Storage").read("morning.pixels2");
      pal = new Uint16Array(E.toArrayBuffer(E.toString(require("Storage").read("morning.pal"))));
      currentCycle = cycleMorning
    }else{
      img1 = require("Storage").read("afternoon.pixels1");
      img2 = require("Storage").read("afternoon.pixels2");
      pal = new Uint16Array(E.toArrayBuffer(E.toString(require("Storage").read("afternoon.pal"))));
      currentCycle = cycleAfternoon;
    }
    img1height = img1.length/240;
    img2height = img2.length/240;
    drawClock(cd);
  }
  // color cycling
  cycle.forEach(c=>{
    var p = pal.slice(c.low,c.high);
    pal[c.low] = pal[c.high];
    pal.set(p,c.low+1);
  });
  // draw image
  g.setColor(-1);
  // draw just the clock part overlaid (to avoid flicker)
  g.drawImages([{x:0,y:OY,image:{width:240,height:img1height,bpp:8,palette:pal,buffer:img1}},
    {image:cgimg,x:IX,y:IY+OY}],
  {x:0,y:OY,width:239,height:img1height});
  // now draw the image on its own below - this is faster
  g.drawImage({width:240,height:img2height,bpp:8,palette:pal,buffer:img2},0,OY+img1height);
}

if (g.drawImages) {
  // draw clock itself and do it every second
  draw();
  var secondInterval = setInterval(draw,100);
  // load widgets
  Bangle.loadWidgets();
  Bangle.drawWidgets();
  // Stop when LCD goes off
  Bangle.on('lcdPower',on=>{
    if (secondInterval) clearInterval(secondInterval);
    secondInterval = undefined;
    if (on) {
      secondInterval = setInterval(draw,100);
      lastTime="";
      draw();
    }
  });
} else {
  E.showMessage("Please update\nBangle.js firmware\nto use this clock","animclk");
}
// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, { repeat: false, edge: "falling" });
