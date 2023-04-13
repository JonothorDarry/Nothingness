const click_event = new MouseEvent("click", {
	view: window,
	bubbles: true,
	cancelable: true,
});

const algorithm_standard = `
		<!DOCTYPE html>
		<div class="primez" id="1"></div>
		<div class="sender" id="2"></div>
		<div class="previous" id="3"></div>
		<div class="next" id="4"></div>
		<div class="comprehend" id="5"></div>
		<div class="finish" id="6"></div>
		<div class="progress" id="7"></div>
`;

const partial_standard = `
               <!DOCTYPE html>
               <div class="primez" id="1"></div>
               <div class="show" id="2"></div>
               <div class="comprehend" id="3"></div>
`;

var algorithm_standard_make = function(id=1, additional_input){
	return `
	<div id="${id}_var">
		<div class="primez" id="${id}_1"></div>
		<div class="sender" id="${id}_2"></div>
		<div class="previous" id="${id}_3"></div>
		<div class="next" id="${id}_4"></div>
		<div class="comprehend" id="${id}_5"></div>
		<div class="finish" id="${id}_6"></div>
		<div class="progress" id="${id}_7"></div>
		${additional_input}
	</div>
	`;
}


var basic_moving_test = function(algorithm, doc){
	doc.getElementsByClassName('sender')[0].dispatchEvent(click_event)
	expect(algorithm.state_nr).toBe(0);
	doc.getElementsByClassName('finish')[0].dispatchEvent(click_event)
	expect(algorithm.state_nr).toBe(algorithm.all_states_nr);

	var prev = doc.getElementsByClassName('previous')[0];
	for (var i=0; i<algorithm.all_states_nr; i++) prev.dispatchEvent(click_event);
	expect(algorithm.state_nr).toBe(0);
	doc.getElementsByClassName('finish')[0].dispatchEvent(click_event)
	expect(algorithm.state_nr).toBe(algorithm.all_states_nr);
}
export {algorithm_standard, algorithm_standard_make, partial_standard, click_event, basic_moving_test};
