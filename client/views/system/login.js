Template.login.events({

    'submit #login-form' : function(e, t){
      e.preventDefault();

      var username = t.find('#login-username').value
        , password = t.find('#login-password').value;

        Meteor.loginWithPassword(username, password, function(err){
        if (err)
			console.log('Incorrect credentials');
        else
			console.log('You have logged in');
      });
         return false; 
      }
  });