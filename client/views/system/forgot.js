if (Accounts._resetPasswordToken) {
  Session.set('resetPassword', Accounts._resetPasswordToken);
} 

Template.forgot.helpers({
  resetPassword : function(t) {
    return Session.get('resetPassword');
  }
});


Template.forgot.events({

    'submit #recovery-form' : function(e, t) {
		e.preventDefault();
		var email = t.find('#recovery-email').value;

      if (email) {
        Session.set('loading', true);
        Accounts.forgotPassword({email: email}, function(err){
        if (err){
		  console.log('Could not process this request');
		Session.set('displayMessage', 'Password Reset Error &amp; Doh');
		}else {
		  console.log('If this email has an account you will get instructions in your inbox.');
          Session.set('displayMessage', 'Email Sent &amp; Please check your email.');
        }
        Session.set('loading', false);
      });
      }
      return false; 
    },

    'submit #new-password' : function(e, t) {
      e.preventDefault();
      var pw = t.find('#new-password-password').value;
      if (pw) {
        Session.set('loading', true);
        Accounts.resetPassword(Session.get('resetPassword'), pw, function(err){
          if (err)
            Session.set('displayMessage', 'Password Reset Error &amp; Sorry');
          else {
            Session.set('resetPassword', null);
          }
          Session.set('loading', false);
        });
      }
    return false; 
    }
});