Template.account.helpers({
	email: function () {
		if(Meteor.user())
			return contactEmail(Meteor.user()); 
  }
});
Template.account.events({
  'click #update': function (e, t) {
	  
  	e.preventDefault();  
	
	var gamertag = t.find("#account-gamertag").value
	, email = t.find("#account-email").value
	, psn = t.find("#account-psn").value
	, newpass = t.find("#account-newpassword").value
	, newcpass = t.find("#account-newcpassword").value
	, password = t.find("#account-password").value;
	
	var user = Meteor.user();
	var updatePassword;
	
	var digest = Package.sha.SHA256(password);
		Meteor.call('checkPassword', digest, function(err, result) {
		if (result) {
			
			console.log('Password match: ok')
			
			if(newpass.length && newcpass.length){
				// update pass
				if(newpass !== newcpass){
					console.log('New passwords do not match.');
					return;
				}
				updatePassword = newpass;
			}else{
				updatePassword = password;
			}
			
			Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.gamertag": gamertag, "profile.psn": psn, "password": updatePassword, "emails.0.address": email}},
			function(err,res){
				console.log(err,res);
			});


		}else{
			console.log('Incorrect password.')
		}
	});
	
	return false;
  }
});