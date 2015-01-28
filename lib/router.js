Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() {
        //return [Meteor.subscribe('posts'), Meteor.subscribe('comments')];
        //return Meteor.subscribe('posts');
        return [Meteor.subscribe('notifications')];
    }
});

Router.map(function() {

    // this.route('postsList', {
    //     path: '/'
    // });

    this.route('postPage', {
        path: '/posts/:_id',
        waitOn: function() {
            return Meteor.subscribe('comments', this.params._id);
        },
        data: function() { return Posts.findOne(this.params._id);}
    });

    this.route('postEdit', {
        path: '/posts/:_id/edit',
        data: function(){ return Posts.findOne(this.params._id);}
    });

    this.route('postSubmit', {
        path: '/submit'
    });

    this.route('postsList', {
        path: '/:postsLimit?',
        waitOn: function() {
            var postsLimit = parseInt(this.params.postsLimit) || 5;
            return Meteor.subscribe('posts', {sort: {submitted: -1}, limit: postsLimit});
        },
        data: function() {
            var limit = parseInt(this.params.postsLimit) || 5;
            return {
                posts: Posts.find({}, {sort: {submitted: -1}, limit: limit})
            };
        }
    });

});

var requireLogin = function(pause) {
    if(! Meteor.user()) {
        if(Meteor.loggingIn()) {
            this.render('loading');
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
}

Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
//Router.onBeforeAction(function() { clearErrors() }); // Doesn't work
