DataBase:-
    User Table
    Post Table
    Follower Table
    Friend-Req Table
    Likes Table
    UserProfile


Api:-
    Authentication:-
        Post:-Signup
        Post:-Login
        Post:-Forgot Password
        Post:-Update UserProfile
        get:in userProfile  show data
    
    
    Create a Post api:-
        post:-post
        Get user Wise post Create:-posts/:userId

        like in post:-post/postId/like
        Get user who liked post:post/postId/likes


    Followe/unFollowe api:-
        post:-Followe/userId
        post:-unFollowe/userId
        post friend/Req:-friendreq/recieverUserId/
        post friend/Req:-friendreq/senderId/accept
        post friend/Req:-friendreq/senderId/reject




user model:-
    user_id
    username
    email
    password
    fname,
    lname,
    profilePic-url,
    bio,
    account privacy
 
post model:-
    post_id,
    tittle,
    description,
    postImage_url,
    user_id refresh mate


Follower model:-
    id 
    follower_id, refrence using user_id
    followed_id,refrence using user_id

friendreq model:-
    senderId
    recieverUserId
    status


PostLike model:
    user_id,
    post_id

UserProfile:
    user_id
    bio
    profilePic

