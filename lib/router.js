Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() {
        //return [Meteor.subscribe('posts'), Meteor.subscribe('comments')];
        //return Meteor.subscribe('posts');
        return [Meteor.subscribe('notifications')];
    }
});


PostsListController = RouteController.extend({
    template: 'postsList',
    increment: 5, 
    limit: function() {
        return parseInt(this.params.postsLimit || this.increment);
    },
    findOptions: function() {
        return {sort: {submitted: -1}, limit: this.limit()};
    },
    waitOn: function() {
        return Meteor.subscribe('posts', this.findOptions());
    },
    data: function() {
        return {posts: Posts.find({}, this.findOptions())};
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
        controller: PostsListController
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
