///////////////////////////////////////////////////////////////////////////////
// Parties

Parties = new Meteor.Collection("parties");

Parties.allow({
  insert: function (userId, party) {
    return false; // no cowboy inserts -- use createParty method
  },
  update: function (userId, party, fields, modifier) {
    if (userId !== party.owner)
      return false; // not the owner

    var allowed = ["title", "description", "x", "y"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

    // A good improvement would be to validate the type of the new
    // value of the field (and if a string, the length.) In the
    // future Meteor will have a schema system to makes that easier.
    return true;
  },
  remove: function (userId, party) {
    // You can only remove parties that you created and nobody is going to.
    return party.owner === userId;
  }
});

attending = function (party) {
  return (_.groupBy(party.rsvps, 'rsvp').yes || []).length;
};

Meteor.methods({
  // options should include: title, description, x, y, public
  createParty: function (options) {
    options = options || {};
    if (! (typeof options.title === "string" && options.title.length &&
           typeof options.description === "string" &&
           options.description.length))
      throw new Meteor.Error(400, "Required parameter missing");
    if (! _.contains(['XB1', 'XB360', 'PS4'], options.console))
      throw new Meteor.Error(400, "Invalid console");
    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    return Parties.insert({
		owner_id: this.userId,
		owner_name: Meteor.user().username,
		title: options.title,
		description: options.description,
		game: options.game,
		type: options.type,
		console: options.console,
		start: options.start,
		end: options.end,
		size: options.size,
		public: !! options.public,
		invited: [],
		rsvps: []
    });
  },
  
  modifyParty: function (party,options) {
    options = options || {};
    if (! (typeof options.title === "string" && options.title.length &&
           typeof options.description === "string" &&
           options.description.length))
      throw new Meteor.Error(400, "Required parameter missing");
    if (! _.contains(['XB1', 'XB360', 'PS4'], options.console))
      throw new Meteor.Error(400, "Invalid console");
    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
    if (this.userId !== party.owner_id)
      throw new Meteor.Error(403, "You must be party leader");

    return Parties.update(party._id, { $set: {
		'title': options.title,
		'description': options.description,
		'game': options.game,
		'type': options.type,
		'console': options.console,
		'end': options.end,
		'size': options.size,
		'public': !! options.public
    }});
  },

  invite: function (partyId, userId) {
    var party = Parties.findOne(partyId);
    if (! party || party.owner !== this.userId)
      throw new Meteor.Error(404, "No such party");
    if (party.public)
      throw new Meteor.Error(400,
                             "That party is public. No need to invite people.");
    if (userId !== party.owner && ! _.contains(party.invited, userId)) {
      Parties.update(partyId, { $addToSet: { invited: userId } });

      var from = contactEmail(Meteor.users.findOne(this.userId));
      var to = contactEmail(Meteor.users.findOne(userId));
      if (Meteor.isServer && to) {
        // This code only runs on the server. If you didn't want clients
        // to be able to see it, you could move it to a separate file.
        Email.send({
          from: "noreply@example.com",
          to: to,
          replyTo: from || undefined,
          subject: "PARTY: " + party.title,
          text:
"Hey, I just invited you to '" + party.title + "' on All Tomorrow's Parties." +
"\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
        });
      }
    }
  },
  closeLobby: function (partyId, ownerId) {
	  
	var party = Parties.findOne(partyId);  
	  
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in to join");
	
    if (!party)
      throw new Meteor.Error(404, "No such lobby.");
	
    if (this.userId !== ownerId)
      throw new Meteor.Error(404, "You are not the party leader.");

	if (Meteor.isServer) {
		
	  	Rooms.remove({roomname: partyId});
	 	Messages.remove({room: partyId});
		Parties.remove({_id: partyId});
	
	}
		
  },
  kick: function (partyId, leaderId, playerId) {
	 
	var party = Parties.findOne(partyId);  
	  
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in.");
	
    if (!party)
      throw new Meteor.Error(404, "No such lobby.");
	
    if (this.userId === playerId)
      throw new Meteor.Error(403, "You cannot kick yourself.");
	
    if (this.userId !== leaderId)
      throw new Meteor.Error(403, "You must be party leader.");
	
	
	if (Meteor.isServer) {
		
		UserSession.delete("lobby",playerId);
		UserSession.set("showKickedDialog",true,playerId);
		
		return Parties.update( {}, { $pull: { rsvps: {user: playerId} } } );
		
	}
	
  },
  leave: function (partyId) {
	  
	var party = Parties.findOne(partyId);
	  
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in.");
	
    if (!party)
      throw new Meteor.Error(404, "No such lobby.");
	
	if (Meteor.isServer) {
		
		return Parties.update( {_id: partyId}, { $pull: { rsvps: {"user": this.userId} } });
		
	}
		
  },
  
  join: function (partyId) {
	  
	var party = Parties.findOne(partyId);
	  
	if (Meteor.isServer) { 
		
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in.");
	
    if (!party)
      throw new Meteor.Error(404, "No such lobby.");
	
    if (_.keys(party.rsvps).length == party.size)
      throw new Meteor.Error(404, "Lobby is full.");
	
    if (!party.public && party.owner !== this.userId && !_.contains(party.invited, this.userId))
      throw new Meteor.Error(403, "This is a private lobby.");
	  
	party.rsvps.map(function (person) {
		if (person.user == Meteor.userId()) {
		    throw new Meteor.Error(404, "You are already in this lobby.");
		}
	});	 

    

      return Parties.update( {_id: partyId}, { $push: {rsvps: { user: this.userId} } });
					 
  	}
	
  }
});
