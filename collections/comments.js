Comments = new Meteor.Collection('comments');

Meteor.methods({
	comment: function(commentAttributes) {
		var user = Meteor.user();
		var post = Posts.findOne(commentAttributes.postId);

		// Ensure the user is logged in
		if (!user) {
			throw new Meteor.error(401, "You need to login to make comments");
		}
		if(!commentAttributes.body){
			throw new Meteor.error(422, "Please write some content");
		}
		if(!post){
			throw new Meteor.error(422, "You must comment on a post");
		}

		comment = _.extend(_.pick(commentAttributes, 'postId', 'body'), {
			userId: user._id,
			author: user.username,
			submitted: new Date().getTime()
		});

		// Update the post with the number of comments
		Posts.update(comment.postId, {$inc: {commentsCount: 1}});

		// Create the comment, save the id
		comment._id = Comments.insert(comment);

		// Now create a notification, informing the user that there's been a comment
		createCommentNotification(comment);

		return comment._id;
	}
});
