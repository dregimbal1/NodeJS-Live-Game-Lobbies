///////////////////////////////////////////////////////////////////////////////
// Create Lobby

Template.create.events({
  'click #create': function (e, t) {
	
	e.preventDefault();  
	
    var title = t.find("#lobby-title").value
    , description = t.find("#lobby-description").value
	, game = t.find("#lobby-game").value
	, type = t.find("#lobby-type").value
	, console = t.find("#lobby-console").value
	, start = t.find("#lobby-start").value
	, end = t.find("#lobby-end").value
	, size = t.find("#lobby-size").value
    , public = ! t.find("#lobby-invite").checked;
    

    if (title.length && description.length) {
      Meteor.call('createParty', {
          title: title,
       	  description: description,
		  game: game,
		  type: type,
		  console: console,
		  start: start,
		  end: end,
		  size: size,
        public: public
      }, function (error, lobby) {
        if (! error) {

		  Rooms.insert({roomname: lobby});
		  UserSession.set("lobby", lobby);
		  UserSession.set("roomname", lobby);
		  Router.go('lobby', {_id: lobby});
          if (! public && Meteor.users.find().count() > 1)
            UserSession.set("showInviteDialog", true);
        }
      });
      
    } else {
      UserSession.set("createError",
                  "It needs a title and a description, or why bother?");
    }
	
	return false; 
  }
});

Template.create.helpers({
  error: function () {
    return UserSession.get("createError");
  }
});

