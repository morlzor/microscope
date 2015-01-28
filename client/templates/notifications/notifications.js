Template.notifications.helpers({
	
	notifications: function() {
		return Notifications.find({userId: Meteo.userId(), read: false});
	},

	notificationCount: function() {
		return Notifications.find({userId: Meteor.userId(), read: false}).count();
	}
});

Template.notification.helpers({
	notificationPostPath: function() {
		return Router.routes.postPage.path({_id: this.postId});
	}
}); // Note: on the .pdf, the code doesnt have a ';' here.

Template.notification.events({
	'click a': function() {
		Notifications.update(this._id, {$set: {read: true}});
	}
}); // Note 2: on the .pdf, the code doesnt have a ';' here.