///////////////////////////////////////////////////////////////////////////////
// Manage dialog

Template.manageDialog.helpers({
  user: function () {
	  var u = Meteor.users.findOne({"_id": UserSession.get("showManageDialog_user").user});
	  return u;
  }
});

Template.manageDialog.events({
  'click .done': function (event, template) {
    UserSession.set("showManageDialog", false);
	UserSession.set("showManageDialog_user", "");
    return false;
  },
  'click .kick': function () {
	  var lobby = Template.parentData(1);
	  var user = UserSession.get("showManageDialog_user").user;
	  Meteor.call("kick", lobby._id, lobby.owner_id, user);
	  console.log('party leader kicked ' + user);
      UserSession.set("showManageDialog", false);
  	  UserSession.set("showManageDialog_user", "");
	  return false;
  }
});