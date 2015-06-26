///////////////////////////////////////////////////////////////////////////////
// Kicked dialog

Template.kickedDialog.events({
  'click .done': function (event, template) {
    UserSession.set("showKickedDialog", false);
    return false;
  }
});