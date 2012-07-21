App.client = new usergrid.Client('Graphyl',<CLIENT_ID>,<CLIENT_SECRET>);

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
