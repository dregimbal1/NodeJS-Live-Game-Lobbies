Template.register.events({
  'submit #register-form' : function(e, t) {
    e.preventDefault();
    var username = t.find('#register-username').value
	  , email = t.find('#register-email').value
      , password = t.find('#register-password').value
	  , cpassword = t.find('#register-cpassword').value
   	  , gamertag = t.find('#register-gamertag').value
	  , psn = t.find('#register-psn').value;

     
	  if(password !== cpassword){
	  	  console.log('Passwords do not match!');
		  return;
	  }
	  
	  if(!username){
	  	  console.log('You must specify a username!');
		  return;
	  }
	  
	  if(!password || !cpassword){
	  	  console.log('You must specify a password!');
		  return;
	  }
	  

    Accounts.createUser({username: username, email: email, password: password, profile: { user: username, gamertag: gamertag, psn: psn }}, function(err){
        if (err) {
			console.log(err);
        } else {
			console.log('Account created!');
        }

      });

    return false;
  }
});