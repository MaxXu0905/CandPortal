	
/***
 * 倒计时
 * zengjie
 * 2014/2/20
 */
(function($){
	$(function(){
		$('#countdown_dashboard').countDown({
			targetOffset: {
				'day': 		1,
				'month': 	1,
				'year': 	0,
				'hour': 	1,
				'min': 		1,
				'sec': 		1
			}
		});
	});
	// Stop countdown
	function stop() {
		$('#countdown_dashboard').stopCountDown();
	}

	// Start countdown
	function start() {
		$('#countdown_dashboard').startCountDown();
	}

	// reset and start
	function reset() {
		$('#countdown_dashboard').stopCountDown();
		$('#countdown_dashboard').setCountDown({
			targetOffset: {
				'day': 		1,
				'month': 	1,
				'year': 	0,
				'hour': 	1,
				'min': 		1,
				'sec': 		1
			}
		});				
		$('#countdown_dashboard').startCountDown();
	}

})(jQuery);
