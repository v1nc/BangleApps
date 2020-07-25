(() => {

	function locked(){
		draw();
	}
	function blockButtons(){
		setWatch(locked, BTN1,{edge:"rising"});
		setWatch(locked, BTN2,{edge:"rising"});
		setWatch(locked, BTN3,{edge:"rising"});
	}
	function draw() {
		g.reset();
   		g.clear();
  		g.setFontAlign(0,0);
  		g.setFont("Vector",10);
  		g.drawString("The screen is locked!",120,120);
        g.setFont("Vector",8);

        g.drawString("Hit 123 to unlock.",120,140);
 	}
	Bangle.on('lcdPower',function(on) {
	  if (on){
	  	blockButtons();
	  }
	});

})()