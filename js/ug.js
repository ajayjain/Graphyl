App.client = new usergrid.Client('Graphyl','YXA6Hp_LbbHTEeGLmRIxOBxATw','YXA61MF5BhhWL6KjuCMXG12XT-F2x4o');

App.client.fetchGraphs = function() {
	window.App.client.apiRequest('GET', '/jainlabs/Graphyl/graphs?filter=points', null, null,
		function(p) {
			console.log('data fetch success',p);
			localStorage.setItem('graphs',JSON.stringify(p));
			//console.log('ls',localStorage.getItem('graphs'));
		},
		function(p) {
			console.log('data fetch failure',p);
		}
	);
	return JSON.parse(localStorage.getItem('graphs'));
}