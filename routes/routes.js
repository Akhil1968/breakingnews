exports.breakingNewsPageHandler = function(req, res){
	res.render('breakingNews.handlebars', {});
}

exports.loginPageHandler = function(req, res){
	req.session.destroy();
	console.log("Admin Login Page");
	res.render('login.handlebars', {});
}

exports.newNewsPageHandler = function(req, res){
	console.log("processing GET request for landing page. Req Param  " + req.query.nm);
	var person;
	var password;
	if (req.session.userName){   //session store has userName
		console.log("User Name already in session. It is " + req.session.userName);
		person = req.session.userName;
	}else{ //session store does NOT have userName
		// read username from req.query and keep into the session store
		person = req.query.nm;
		password = req.query.pwd;
		req.session.userName = person;
		console.log("User Name does not exist in session. Hence storing it in session store " + person);
	}

	res.render('newNews.handlebars', {userName:person});
}

