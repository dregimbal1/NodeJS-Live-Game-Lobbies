///////////////////////////////////////////////////////////////////////////////
// Party attendance widget

Template.attendance.helpers({
  playerName: function () {
    
	var user = Meteor.users.findOne(this.user);
		
	if(this.console == "PS4"){
		return user.profile.psn;
	}else{
		return user.profile.gamertag;
	}
	
	
  },
  onlineStatus: function(){
	var user = Meteor.users.findOne(this.user);
	if (user.status.idle)
		return "label-warning"
	else if (user.status.online)
		return "label-success"
	else
		return "label-default"
  },
  outstandingInvitations: function () {
    var party = Parties.findOne(this._id);
    return Meteor.users.find({$and: [
      {_id: {$in: party.invited}}, // they're invited
      {_id: {$nin: _.pluck(party.rsvps, 'user')}} // but haven't RSVP'd
    ]});
  },
  invitationName: function () {
    return displayName(this);
  },
  nobody: function () {
    return (this.rsvps.length + this.invited.length === 0);
  },
  canInvite: function () {
    return ! this.public && this.owner === Meteor.userId();
  },
  isPartyLeader: function(){
	  var lobby = Template.parentData(1);
	  return lobby.owner_id === Meteor.userId();
  },
  inLobby: function(){
	  var lobby = Template.parentData(1);
	  return UserSession.get("lobby") === lobby._id;
  }
});

Template.attendance.events({
  'click .leave': function () {
	  var title = this.title;
	  
	 
		  
		Meteor.call("leave", this._id, function(e,r){
			if(e)
				console.log(e);
			else
				console.log('You left the lobby');
				UserSession.delete("lobby");
				Router.go("lobbies");
		});
		

	  
	  return false;
  },
  'click .join': function () {
	  console.log(this);
	  Meteor.call("join", this._id);
	  UserSession.set("lobby",this._id);
	  return false;
  },
  'click .manage': function () {
	  UserSession.set("showManageDialog_user", this);
      UserSession.set("showManageDialog", true);
      return false;
  }
});
