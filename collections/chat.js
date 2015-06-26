///////////////////////////////////////////////////////////////////////////////
// Chat rooms

Messages = new Meteor.Collection("chatmessages");
Rooms = new Meteor.Collection("chatrooms");

if (Meteor.isServer) {
  Meteor.startup(function () {
    //Messages.remove({});
   // Rooms.remove({});
  });
  
  Rooms.deny({
      update: function (userId, doc, fieldNames, modifier) {
        return true;
      }	
  });
  
  Rooms.allow({
    insert: function (userId, doc) {
		return (userId !== null);
    },
    remove: function (userId, doc) {
      return true;
    }
  });
  Messages.deny({
    insert: function (userId, doc) {
      return (userId === null);
    },
    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },
    remove: function (userId, doc) {
      return true;
    }
  });
  Messages.allow({
    insert: function (userId, doc) {
      return (userId !== null);
    }
  });
  
  Meteor.publish("chatrooms", function () {
    return Rooms.find();
  });
  Meteor.publish("chatmessages", function () {
    return Messages.find({}, {sort: {ts: -1}});
  });
}