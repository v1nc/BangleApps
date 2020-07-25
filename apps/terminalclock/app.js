const settings = require("Storage").readJSON("terminalclock.json", 1);
const BTN1app = settings.BTN1 || "";
const BTN3app = settings.BTN3 || "";
const BGC = settings.BGC || "#1f1f1f";
const FGC = settings.FGC || "#C0A35B";
const EC = settings.EC || "#991c1c";
const SC = settings.SC || "#679480";
const canvasLeft = 20;
const canvasTop = 20;
const margin = 15;
const USER = "vinc";
const DEVICE ="BangleJS";
const CMD ="clock";

function draw() {
  var d = new Date();
  var h = d.getHours(), m = d.getMinutes();
  var timeString = (" "+h).substr(-2) + ":" + ("0"+m).substr(-2);
  const dateString = require("locale").date(d);
  const data = {
    "time": timeString,
    "date": dateString,
    "battery" : ""+E.getBattery()+" %",
    "charging" : Bangle.isCharging(),
  };
  g.reset();
  g.setColor(BGC);
  g.fillRect(0, 0, g.getWidth(), g.getHeight());
  g.setFont("6x8",1);
  g.setColor(FGC);
  g.setBgColor(BGC);
  g.drawString(USER+"@"+DEVICE+":~$ "+CMD,canvasLeft, canvasTop,true);
  var lineY = canvasTop+margin;
  for(let key in data){
     g.drawString("["+key+"]: "+data[key],canvasLeft, lineY,true);
     lineY = lineY+margin;
  }
}

g.clear();
draw();
var secondInterval = setInterval(draw, 1000);
Bangle.on('lcdPower',on=>{
  if (secondInterval) clearInterval(secondInterval);
  secondInterval = undefined;
  if (on) {
    secondInterval = setInterval(draw, 1000);
    draw();
  }
});
setWatch(Bangle.showLauncher, BTN2, { repeat: false, edge: "falling" });
if (BTN1app) setWatch(
  function() {
    load(BTN1app);
  },
  BTN1,
  { repeat: false, edge: "rising" }
);
if (BTN3app) setWatch(
  function() {
    load(BTN3app);
  },
  BTN3,
  { repeat: false, edge: "rising" }
);