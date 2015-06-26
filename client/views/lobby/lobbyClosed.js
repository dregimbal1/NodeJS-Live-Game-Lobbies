Template.lobbyClosed.events({
  'click .session': function () {

		  
	  UserSession.delete("lobby");

	  
	  return false;
  }
});