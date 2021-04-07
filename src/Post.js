import React, {useEffect, useState} from 'react'
import './Post.css'
import Avatar from "@material-ui/core/Avatar"
import {db} from './firebase'
import firebase from 'firebase'
import Comments from './Comments'
function Post({user, PostId, username, caption, imageUrl}) {
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState([])
    const [activatePost, setActivatePost] = useState(false)

    useEffect(() =>{
        let unsubscribe;
        if(PostId){
            unsubscribe = db
            .collection("posts")
            .doc(PostId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) =>{
                    return(doc.data())
                }))
            })
        }
        return () =>{
            unsubscribe();
        }
    }
    ,[PostId]); 
    const postComment = (e) =>{
        e.preventDefault();
        db.collection("posts").doc(PostId).collection("comments").add({
            username: user.displayName,
            text: comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment("");
    }
    
    useEffect(()=>{
        if(user){

            if(comment!=""){
                setActivatePost(true);
            }
            else setActivatePost(false);
        }
    },[comment,user])
    return (
        <div className="post">
            <div className="post__header">  
                <Avatar 
                className="post__avatar"
                src="/static/images/avatar/1.jpg"
                alt={username}
                />
                <h3 className="post__username">{username}</h3>
            </div>
            

            <img className="post__image" src={imageUrl}
            alt="tp" />
            <left>
            <h4 className="post__text"><strong>{username} </strong>{caption}</h4>
            <div className="post__comments">
                {
                    comments.map((cur)=>(
                        <div>
                        <p/>
                            <Comments key={cur.id} username={cur.username} text={cur.text}/>
                        </div>
                    ))
                }
            </div>
            </left>
            <form className="post__commentBox">
                <input 
                    type="text"
                    value={comment}
                    placeholder="Add a comment here"
                    className="post__input"
                    onChange={(e)=> setComment(e.target.value)}
                />
                <button
                    className="post__button"
                    disabled={!activatePost}
                    onClick={postComment}
                    type="submit"
                >
                    Post
                </button>
            </form>
        </div>
    )
}

export default Post
