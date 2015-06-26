Template.lobby.helpers({
  context: function() {
    return _.clone(this);
  },
  getStatus: function() {
	  if(this.public){
		  return "Public";
	  }else{
		  return "Private";
	  }
  },
  playercount: function(){
	  return _.keys(this.rsvps).length;
  },
  hostConsoleID: function(){
	  var host = Meteor.users.findOne({"_id":this.owner_id});
	  if(this.console == "PS4"){
		  return host.profile.psn;
	  }else{
		  return host.profile.gamertag;
	  }
  },
  isPartyLeader: function(){
	  return this.owner_id === Meteor.userId();
  },
  showManageDialog: function () {
    return UserSession.get("showManageDialog");
  },
  showModifyDialog: function () {
    return UserSession.get("showModifyDialog");
  },
});


Template.lobby.events({
  'click .closeLobby': function () {
	  Meteor.call("closeLobby", this._id, this.owner_id);
	  console.log('You have closed the lobby');
	  UserSession.delete("lobby");
	  Router.go("lobbies");
	  return false;
  },
  'click .modifyLobby': function () {
      UserSession.set("showModifyDialog", true);
      return false;
  }
});