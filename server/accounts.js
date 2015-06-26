///////////////////////////////////////////////////////////////////////////////
// accounts server

Accounts.onCreateUser(function(options, user) {

	if (options.profile)
		user.profile = options.profile;
	
    return user;
});

Meteor.methods({
	checkPassword: function(digest) {
		check(digest, String);
		if (this.userId) {
			var user = Meteor.user();
			var password = {digest: digest, algorithm: 'sha-256'};
			var result = Accounts._checkPassword(user, password);
			return result.error == null;
		} else {
			return false;
		}
	}
});