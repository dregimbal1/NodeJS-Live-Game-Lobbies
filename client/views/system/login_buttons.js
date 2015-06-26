Template.loggedin.events({
	'click #logout': function(e, tmpl) {
		Meteor.logout(function(err){
			  if (err) {
				  console.log('Could not log you out.', err)
			  } else {
				  console.log('You have logged out.');
				  Router.go('/');
			  }
		});
	}
});