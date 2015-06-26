
// lobbies js
Template.lobbies.helpers({
  parties: function () {
    return Parties.find({}, {fields: {_id: 1, owner_name: 1, title: 1, description: 1, game: 1, type: 1, start: 1, rsvps: 1, end: 1, size: 1, public: 1}});
  },
  settings: function () {
      return {
          rowsPerPage: 10,
          showFilter: true,
          fields: [
  			{ key: 'title', label: 'Title' },
   		    { key: 'game', label: 'Game' },
  			{ key: 'type', label: 'Type' },
			{ key: 'size', label: 'Size' }, 
			{ key: 'start', label: 'Start' },
			{ key: 'end', label: 'End' },
			  { key: 'owner_name', label: 'Host' }
		]
      };
  },
  playercount: function(){
	  return _.keys(this.rsvps).length;
  },
  isFull: function(){
	  return _.keys(this.rsvps).length == this.size;
  },
  isPublic: function(id){
	  var state = Parties.findOne({_id: id}, {fields: {public: 1}});
	  return state.public;
  },
  inLobby: function(){
	  return UserSession.get("lobby");
  },
  showKickedDialog: function () {
    return UserSession.get("showKickedDialog");
  },
});

Template.lobbies.events({
  'click .join': function () {
	  var lobby = this;
	  
	  console.log('click join');
	  


	  Meteor.call("join", lobby._id, function(e,r){
		  if(e){
			  console.log(e, 'an error occured');
		  }else{
			  console.log(r,'joined the lobby');
		      UserSession.set("lobby",lobby._id);
		      UserSession.set("roomname", lobby._id);
			  Router.go("lobby", {_id: lobby._id});
	      }
	  });
	  

	  
	  

	  
	  //return false;
  },
  'click .createLobby': function () {
	  Router.go("create");
	  return false;
  }
});