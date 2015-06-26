// Live Game Lobbies -- client

Meteor.subscribe("directory");
Meteor.subscribe("parties");

Meteor.subscribe("chatrooms");
Meteor.subscribe("chatmessages");

Meteor.subscribe('lobby');



/*
	Router
*/
Router.configure({
    layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function () {
		return [Meteor.subscribe("parties"),Meteor.subscribe("directory")];
	},
});


Router.route('/', function () {
	
	
		if(UserSession.get("lobby")){
			this.redirect('lobby', {_id: UserSession.get("lobby")});
		}else{
			if (Meteor.userId()) {
				this.render('lobbies'); 
			}else{
				this.render('homepage'); 
			}
		}	

	
});  

Router.route('/register', function () {
	if (Meteor.userId()) {
		this.render('lobbies'); 
	}else{
		this.render('register');
	}
});

Router.route('/forgot', function () {
	if (Meteor.userId()) {
		this.render('lobbies'); 
	}else{
		this.render('forgot');
	}
});

Router.route('/lobbies', function () {


		if(UserSession.get("lobby")){
	
			var lobby = Parties.find({"_id": UserSession.get("lobby")});
	
			if(!lobby){
				UserSession.delete("lobby");
				this.redirect('lobbies');
			}else{
				this.redirect('lobby', {_id: UserSession.get("lobby")});
			}
	
	
		}else{
			this.render('lobbies');
		}
	

	
});

Router.route('/create', function () {
	this.render('create');
	/*
	if(UserSession.get("lobby")){
		this.redirect('lobby', {_id: UserSession.get("lobby")});
	}else{
		this.render('create');
	}
	
	*/

});


Router.route('/account', function () {
	this.render('account');
});


Router.map( function () {
	
	
	this.route('lobby', {

		template: 'lobby',
		path: '/lobby/:_id',
		data: function() {        
			//return Parties.findOne({"_id": this.params._id});
		    if(this.ready()){
				
				
				
			
			
				var lobby = Parties.findOne({"_id": this.params._id});
				if(!lobby){
					
					if(UserSession.get("lobby")){
						this.render('lobbyClosed');
					}else{
						this.render('lobbies');
					}
					
					
		
					return;
				}else{
					if(! UserSession.get("lobby") ){
						this.render('lobbies');
					}else{
						return lobby;
					}
					
				}
			
			
			
			}
			
		}
	});
});

/*
Router.route('/lobby/:_id', function () {
  var lobby = Parties.findOne({_id: this.params._id});
  this.render('lobby', {lobby: lobby});
});
*/


var OnBeforeActions = {
    loginRequired: function(pause) {
		if (! Meteor.userId()) {
			this.render('homepage');
		}else{
			this.next();
		}
    }
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
    except: ['homepage','register','forgot']
});

Router.onBeforeAction('dataNotFound', {only: 'lobby'});


/*
	Startup Functions
*/
Meteor.startup(function () {
  Meteor.autorun(function () {
    if (! Session.get("selected")) {
      var party = Parties.findOne();
      if (party) {
        Session.set("selected", party._id);
      }
    }

  });
});


