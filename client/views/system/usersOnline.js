Template.usersOnline.helpers({
	labelClass: function () {
		if (this.status.idle)
			return "label-warning"
		else if (this.status.online)
			return "label-success"
		else
			return "label-default"
	},
	usersOnline: function() {
		return Meteor.users.find({"status.online": true});
	}
});