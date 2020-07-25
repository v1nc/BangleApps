(() => {

	function locked(){
		//nothing
	}
	function blockButtons(){
		setWatch(locked, BTN1, {repeat:false,edge:"falling"});
		setWatch(locked, BTN2, {repeat:false,edge:"falling"});
		setWatch(locked, BTN3, {repeat:false,edge:"falling"});
	}
	
	Bangle.on('lcdPower',function(on) {
	  if (on){
	  	blockButtons();
	  }
	});

})()