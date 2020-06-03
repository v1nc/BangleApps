const settings = require("Storage").readJSON("terminalclock.json", 1);
const BTN1app = settings.BTN1 || "";
const BTN3app = settings.BTN3 || "";
const BGC = settings.BGC || "";
const FGC = settings.FGC || "";
const EC = settings.EC || "";
const SC = settings.SC || "";

// Load fonts
require("Font7x11Numeric7Seg").add(Graphics);
// position on screen
const X = 160, Y = 140;

function draw() {
  // work out how to display the current time
  var d = new Date();
  var h = d.getHours(), m = d.getMinutes();
  var time = (" "+h).substr(-2) + ":" + ("0"+m).substr(-2);
  // Reset the state of the graphics library
  g.reset();
  //set BG color
  g.setColor(BGC);
  g.fillRect(0, 0, g.getWidth(), g.getHeight());
  // draw the current time (4x size 7 segment)
  g.setFont("7x11Numeric7Seg",4);
  g.setFontAlign(1,1); // align right bottom
  g.setColor(FGC);
  g.setBgColor(BGC);

  g.drawString(time, X, Y, true /*clear background*/);
  // draw the seconds (2x size 7 segment)
  g.setFont("7x11Numeric7Seg",2);
  g.drawString(("0"+d.getSeconds()).substr(-2), X+30, Y, true /*clear background*/);
  // draw the date, in a normal font
  g.setFont("6x8");
  g.setFontAlign(0,1); // align center bottom
  // pad the date - this clears the background if the date were to change length
  var dateStr = "    "+require("locale").date(d)+"    ";
  g.drawString(dateStr, g.getWidth()/2, Y+15, true /*clear background*/);
}

// Clear the screen once, at startup
g.clear();
// draw immediately at first
draw();
var secondInterval = setInterval(draw, 1000);
// Stop updates when LCD is off, restart when on
Bangle.on('lcdPower',on=>{
  if (secondInterval) clearInterval(secondInterval);
  secondInterval = undefined;
  if (on) {
    secondInterval = setInterval(draw, 1000);
    draw(); // draw immediately
  }
});
// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();
// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, { repeat: false, edge: "falling" });
//Open custom apps when left or right button pressed
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