var sys = require('sys'),
	connect = require('connect'),
	couchdb = require('./couchdb');
	client = couchdb.createClient(5984, 'localhost');

//Couch elements...
	users = client.db('users');

//Loki
var Loki = function () {
	var self = this;
}

Loki.prototype = {
	parsePost: function (post) {
		json = '{';
		array = post.toString().split("&");
		for (i=0;i<array.length;i++){
			json += '"'+array[i].split("=")[0]+'":"'+array[i].split("=")[1]+'",';
		}
		json = json.substring(0, json.length-1);
		json += '}';
		return JSON.parse(json);
	},

	registerUser: function (req,resp){
		post = this.parsePost(req.postdata);

		users.getDoc(post.username, function(er, doc) {
			if(er.error == 'not_found'){
				users.saveDoc(post.username, {username:post.username,password:post.password},function(er,ok){
					if(er){
						resp.send('error, database connection');
					}else{
						resp.send('success');
					}						
				});
			}else{
				resp.send('error, usuario no disponible');
			}
		})	
	},

	logInUserController: function (req,resp){
		post = this.parsePost(req.postdata);

		user = this.logInUser(post.username,post.password,req,resp);
	},

	logInUser: function (user,password,req,resp){
		console.log('user:'+user+',password:'+password)
		users.getDoc(user, function(er, doc) {
			if(er){
				console.log(er);
				resp.send('No user found');
			}else{
				console.log(doc);
				if(password == doc.password){
	                req.session.regenerate(function(err){
	                    var user = req.session.user = doc;
						resp.send('Password match on user:'+ JSON.stringify(doc));						
					})

				}else{
					resp.send('Password doesnt match');
				}
			}
		})
	}
}

module.exports = new Loki;


	
