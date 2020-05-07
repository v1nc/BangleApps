var storage = require('Storage');

//notify your phone
function find(){
 Bluetooth.println(JSON.stringify({t:"findPhone", n:true}));
}

//init graphics
g.clear();
require("Font8x12").add(Graphics);
g.setFont("8x12",3);
g.setFontAlign(0,0);
g.flip();

//init settings
const settings = storage.readJSON('setting.json',1) || { HID: false };

//check if HID enabled and show message
if (settings.HID=="kb" || settings.HID=="kbmedia") {
	g.setColor(0x03E0);
	g.drawString("click to find", g.getWidth()/2, g.getHeight()/2);
	
	//register all buttons and screen to find phone
	setWatch(find, BTN1);
	setWatch(find, BTN2);
	setWatch(find, BTN3);
	setWatch(find, BTN4);
	setWatch(find, BTN5);

}else {
  E.showPrompt("Enable HID?",{title:"HID disabled"}).then(function(enable) {
    if (enable) {
      settings.HID = "kbmedia";
      require("Storage").write('setting.json', settings);
      setTimeout(load, 1000, "hidcam.app.js");
    } else setTimeout(load, 1000);
  });
}
