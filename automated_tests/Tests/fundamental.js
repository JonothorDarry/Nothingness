var static_application_assets_path = '../../../static';
const click_event = new MouseEvent("click", {
	view: window,
	bubbles: true,
	cancelable: true,
});

var algorithm_standard = function(input){
return `
		<!DOCTYPE html>
		<div class="primez" id="1"></div>
		<div class="sender" id="2"></div>
		<div class="previous" id="3"></div>
		<div class="next" id="4"></div>
		<div class="comprehend" id="5"></div>
		<div class="finish" id="6"></div>
		<div class="progress" id="7"></div>
		<input class="inputter" value="${input}" id="8">
	`;
}

var partial_standard = function(input){
return `
		<!DOCTYPE html>
		<div class="primez" id="1"></div>
		<div class="show" id="2"></div>
		<div class="comprehend" id="3"></div>
		<input class="inputter" value="${input}" id="4">
	`;
}

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

var trees = {
	'basic_tree_1':`
	8
	1 2
	1 3
	3 4
	4 5
	3 6
	3 7
	7 8
	`,
	'basic_tree_2':`
	8
	1 2
	1 3
	1 4
	1 5
	1 6
	1 7
	1 8
	`,
	'basic_tree_3':`
	8
	1 2
	2 3
	3 4
	4 5
	5 6
	6 7
	7 8
	`,
	'basic_tree_4':`
	7
	1 2
	1 3
	2 4
	2 5
	3 6
	3 7
	`,
	'megatree':`
	22
	1 2
	1 3
	3 4
	4 5
	3 6
	3 7
	7 8
	8 9
	8 10
	8 11
	11 12
	6 13
	13 14
	14 15
	15 16
	16 17
	16 18
	17 19
	17 20
	16 21
	21 22
	`
};



export {algorithm_standard, algorithm_standard_make, partial_standard, click_event, basic_moving_test, static_application_assets_path, trees};

