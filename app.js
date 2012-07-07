var App = {
	graphUtils: {
		equations: [],
		add: function(id, eq) {
			console.log('id',id);
			var graph = document.getElementById(id);
			console.log('graph',graph)
			if (eq==='prompt') eq = prompt('Equation').toLowerCase();
			graph.contentWindow.postMessage('add:'+eq, "http://graph.tk");
			
			this.equations.push(eq);

			// ERROR - Unsafe JavaScript attempt to access frame with URL http://graph.tk/ from frame with URL http://degree7.com/apps/graph/#page3. Domains, protocols and ports must match.
			//var img = $(graph).contents().find('canvas')[0].toDataURL();
			//console.log('img',img);
			
			var outputID = document.getElementById(id).getAttribute('data-output');
			var output   = document.getElementById(outputID);
			
			var eqOut = '<div class="equation"><strong>'+eq+'</strong><br></div>';
			
			$(output).append(eqOut);
		},
		center: function(id) {
			var graph = document.getElementById(id);
			graph.contentWindow.postMessage('center:0,0', "http://graph.tk");
		},
		empty: function(id) {
			var graph = document.getElementById(id);
			graph.contentWindow.postMessage('empty', "http://graph.tk");
			this.equations = [];
		},
		share: function(eqs, caption) {
			if (eqs || this.equations) {
				var data = {
					"equations": eqs || this.equations,
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
		}
	},
	utils: {
		fetchGraphs: function() {
			window.App.client.apiRequest('GET', '/Graphyl/graphs?filter=points', null, null,
				function(p) {
					console.log('data fetch success',p);
					localStorage.setItem('graphs',JSON.stringify(p));
					console.log('ls',localStorage.getItem('graphs'));
				},
				function(p) {
					console.log('data fetch failure',p);
				}
			);
			return JSON.parse(localStorage.getItem('graphs'));
		}
	},
	client: new usergrid.Client('Graphyl','YXA6Hp_LbbHTEeGLmRIxOBxATw','YXA61MF5BhhWL6KjuCMXG12XT-F2x4o'),
	init: function() {
		console.log('init begin');
		this.client.currentOrganization = 'jainlabs';

		// Login
			var nowLoggedIn = function() {
				console.log('logged in');
				$.mobile.changePage($("#page3"));
				
				var pgraph = document.getElementById('playground-graph');
				pgraph.onload = function() {
					pgraph.contentWindow.postMessage('center:0,0', "http://graph.tk");
				}
				
				var graphs = window.App.utils.fetchGraphs().entities || false;
				if (graphs) {
					$.each(graphs, function(index, value) {
					  console.log(index,value);
					  var eqsString = '';
					  for (var x = 0, len = value.equations.length; x<len; x++) {
					        eqsString += '<div class="equation"><strong>' + value.equations[x] + '</strong></div><br>';
					  }
					  var graph_template = "<div class='graph-item'> \
					  							<center><h3 style='display:inline-block'>"+value.caption+"</h3> by "+value.creator+" (2 votes)</center>\
					  							<center><iframe src=\"http://graph.tk/#"+value.equations[0]+"\"></iframe></center>\
					  							<center><div data-role=\"controlgroup\" data-type=\"horizontal\" class=\"tools\">\
					  								<a href='' data-role='button' data-mini='true'>Upvote</a>\
					  								<a href='#page3' data-role='button' data-mini='true'>Regraph</a>\
					  							</div></center>"+eqsString+"\
					  						</div><br>";
					  $('#page5').append(graph_template);
					});
				}
			}
			
			if (!window.App.client.loggedInUser) { var loggedIn = false; } else { var loggedIn = true; }
	
			if (loggedIn===false) {
				console.log('not logged in');
				$.mobile.changePage($("#login"));
				$('#login_form').submit(function(f) {
					console.log('f',f);
					var form = $('#login_form').serialize().split('&');
					console.log('form',form);
					
					window.App.client.loginAppUser("Graphyl",form[0].split('=')[1],form[1].split('=')[1],function(p) {
					  	console.log('success',p);
					  	loggedIn = true;
					  	nowLoggedIn();
					  },
					  function(p) {
					  	console.log('failure',p);
					  }
					);
					
				});
			} else if (loggedIn===true) {
				nowLoggedIn();
			}
			
		// Registration
			$('#register_form').submit(function(f) {
				console.log('f',f);
				var form = $('#register_form').serialize().split('&');
				console.log('form',form);
				
				var username = form[0].split('=')[1] || prompt('Please enter a username');
				var fullname = form[2].split('=')[1] || null;
				var email    = form[1].split('=')[1] || prompt('Please enter an email');
				var password = form[3].split('=')[1] || prompt('Please enter a password');
				
				window.App.client.createUser("Graphyl",username,fullname,email,password,function(p) {
				  	console.log('register success',p);
				  	$.mobile.changePage($("#login"));
				  },
				  function(p) {
				  	console.log('register failure',p);
				  	alert('registration failure!');
				  }
				);
				
			});

		console.log('init end');
	},
}

$('document').ready(function() {
	App.init();
});