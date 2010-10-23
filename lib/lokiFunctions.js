var sys = require('sys'),
	couchdb = require('./couchdb');
	client = couchdb.createClient(5984, 'localhost'),

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
				console.log('No hay usuario llamado '+post.username);
				resp.send('success');
			}else{
				console.log('User exist already');
				console.log(doc);
				resp.send('error');
			}
		})	
	}
}

module.exports = new Loki;


	
