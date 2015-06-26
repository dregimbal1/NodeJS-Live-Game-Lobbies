///////////////////////////////////////////////////////////////////////////////
// Modify dialog

Template.modifyDialog.helpers({
  lobby: function () {
	  return this;
  }
});

Template.modifyDialog.events({
  'click .done': function (e, t) {
    UserSession.set("showModifyDialog", false);
    return false;
  },
  'click .modify': function (e, t) {
	  
	var lobby = this;  
	  
	var title = t.find("#lobby-title").value
	, description = t.find("#lobby-description").value
	, game = t.find("#lobby-game").value
	, type = t.find("#lobby-type").value
	, console = t.find("#lobby-console").value
	, end = t.find("#lobby-end").value
	, size = t.find("#lobby-size").value
	, public = ! t.find("#lobby-invite").checked;
	
    if (title.length && description.length) {
		
      Meteor.call('modifyParty', lobby, {
          title: title,
       	  description: description,
		  game: game,
		  type: type,
		  console: console,
		  end: end,
		  size: size,
        public: public
      }, function (error, lobby) {
        if (! error) {

            UserSession.set("showModifyDialog", false);
        }
      });
      
    } else {
      UserSession.set("createError",
                  "It needs a title and a description, or why bother?");
    }
	
	return false;
	
  }
});