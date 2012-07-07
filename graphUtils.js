App.graphUtils = {};

(function(window,document,$,usergrid,undefined) {
	var equations = [];
	App.graphUtils.add = function(id, eq) {
		console.log('id',id);
		var graph = document.getElementById(id);
		console.log('graph',graph)
		if (eq==='prompt') eq = prompt('Equation').toLowerCase();
		graph.contentWindow.postMessage('add:'+eq, "http://graph.tk");
		
		equations.push(eq);

		// ERROR - Unsafe JavaScript attempt to access frame with URL http://graph.tk/ from frame with URL http://degree7.com/apps/graph/#page3. Domains, protocols and ports must match.
		//var img = $(graph).contents().find('canvas')[0].toDataURL();
		//console.log('img',img);
		
		var outputID = document.getElementById(id).getAttribute('data-output');
		var output   = document.getElementById(outputID);
		
		var eqOut = '<div class="equation"><strong>'+eq+'</strong><br></div>';
		
		$(output).append(eqOut);
	};
	App.graphUtils.center = function(id) {
		var graph = document.getElementById(id);
		graph.contentWindow.postMessage('center:0,0', "http://graph.tk");
	};
	App.graphUtils.empty = function(id) {
		var graph = document.getElementById(id);
		graph.contentWindow.postMessage('empty', "http://graph.tk");
		equations = [];
	};
	App.graphUtils.share = function(eqs, caption) {
		if (eqs || equations) {
			var data = {
				"equations": eqs || equations,
				"caption": caption || '',
				"creator": window.App.client.loggedInUser.username,
				"points": 0
			};
			window.App.client.apiRequest('POST', '/Graphyl/graphs', null, JSON.stringify(data),
				function(p) {
					console.log('data insert success',p);
					return true;
				},
				function(p) {
					console.log('data insert failure',p);
					return false;
				}
			);
		} else {
			alert('No equations found!');
			return false;
		}
	};
})(window,document,jQuery,usergrid);