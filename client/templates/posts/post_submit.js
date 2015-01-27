Template.postSubmit.events({
    'submit form': function(event) {
        event.preventDefault();

        var post = {
            url: $(event.target).find('[name=url]').val(),
            title: $(event.target).find('[name=title]').val(),
            message: $(event.target).find('[name=message]').val()
        }

        //post._id = Posts.insert(post);
        //Router.go('postPage', post);

        Meteor.call('post', post, function(error, id) {
            if(error){
                return alert(error.reason);
            }
           //Router.go('postPage', {_id: id});
        });
        Router.go('postsList');
    }
});