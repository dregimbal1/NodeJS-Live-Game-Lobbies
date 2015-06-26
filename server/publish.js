///////////////////////////////////////////////////////////////////////////////
// server

Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1, status: 1}});
});

Meteor.publish("parties", function () {
  return Parties.find({});
});

Meteor.publish("lobby", function () {
	return Parties.find({rsvps: { user: this.userId }});
});