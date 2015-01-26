Posts = new Meteor.Collection('posts');

Posts.allow({
    insert: function(userId, doc) {
        // Only allow posting if the user is logged in
        return !! userId;
    }
});