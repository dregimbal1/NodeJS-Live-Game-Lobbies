Template.homepage.helpers({
  showInviteDialog: function () {
    return Session.get("showInviteDialog");
  },
  showCreateDialog: function () {
    return Session.get("showCreateDialog");
  }
});