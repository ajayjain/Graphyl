App.init = function() {
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
			
			window.App.client.fetchGraphs();
			var graphs = JSON.parse(localStorage.getItem('graphs')).entities || false;
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
};

$('document').ready(function() {
    App.init();
});