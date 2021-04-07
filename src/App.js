import './App.css';
import Post from './Post'
import {useState, useEffect} from 'react';
import {db, auth, storage} from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload'

// function getModalStyle() {
//   const top = 50
//   const left = 50

//   return {
//     top: `${top}%`,
//     left: `${left}%`,
//     transform: `translate(-${top}%, -${left}%)`,
//   };
// }
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 300,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [posts,setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [alertMessage, setAlert] = useState("");
  const [user,setUser] = useState(null)
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() =>{
    const unsubscribe = auth.onAuthStateChanged(authUser =>{
      if(authUser){
        setUser(authUser)
      }
      else{
        //user has logged out
        setUser(null)
      }
    })

    return () =>{
      unsubscribe()
    }
  },[user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot =>{
       setPosts(snapshot.docs.map(doc => ({
         id: doc.id,
         post: doc.data()
       })
       ))
    })
  },[posts])

  useEffect(()=>{
    if(user){
      setOpen(false)
      setOpenSignIn(false)
      setAlert("")
    }
  },[user])

  const signup = (event) =>{
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then(authUser => {
      return (authUser.user.updateProfile({
        displayName: username,
      })
      )
    })
    .catch((error)=> {
      setAlert(error.message)
    });
  }

  const signin = (event) =>{

    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch(error => {
      setAlert(error.message);  
    });
  }

  return (
    <div className="app">
    <center>
    <div>
    <Modal
        open={open}
        onClose={() => setOpen(false)} 
      >
        <div 
        className={classes.paper} 
        style={{
          top: `${50}%`,
          left: `${50}%`,
          transform: `translate(-${50}%, -${50}%)`,
        }}>
        <form>
          <center>
            <img className="app__headerImage" 
              src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt = "instagram"/>
              <p/>
              <Input 
                placeholder="username" 
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="signup"
              /> 
              <p/>
              <Input 
                placeholder="email" 
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="signup"
              /> 
              <p/>
              <Input 
                placeholder="password" 
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="signup"
              /> 
              <p/>
              <Button type="submit" onClick={signup}>Sign Up</Button>
              <p/>
              <div className="signup__alert"> {alertMessage} </div>
            </center>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)} 
      >
        <div 
        className={classes.paper} 
        style={{
          top: `${50}%`,
          left: `${50}%`,
          transform: `translate(-${50}%, -${50}%)`,
        }}>
        <form>
          <center>
            <img className="app__headerImage" 
              src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt = "instagram"/>
              <p/>
              <Input 
                placeholder="email" 
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="signup"
              /> 
              <p/>
              <Input 
                placeholder="password" 
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="signup"
              /> 
              <p/>
              <Button type="submit" onClick={signin}>Sign In</Button>
              <p/>
              <div className="signup__alert"> {alertMessage} </div>
            </center>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage" 
        src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt = "instagram"/>
        {user ? 
        (
          <div style={{
            display:'flex'
          }
          }>
          <h4 style={{
            fontWeight: 'normal',
            marginRight: '10px'
          }}>Currently logged in as  <strong>{user.displayName}  </strong> </h4>
          <Button onClick={() => {
            auth.signOut()
          }}>
          Log out
          </Button>
          </div>
        )
      :
       (<div className="app__loginContainer">
         <Button onClick={() => setOpen(true)}> Sign Up</Button>
          <Button onClick={() => {setOpenSignIn(true)}}>Sign in</Button>
       </div>
       )
      }
      </div>  
      <div className="app__posts">
      {
        posts.map((cur_post) => {
          return(
            <Post 
            user={user}
            key={cur_post.id}
            PostId={cur_post.id} 
            username={cur_post.post.username} 
            caption={cur_post.post.caption} 
            imageUrl={cur_post.post.imageUrl}/>)
        })
      }
      </div>
    </div>
      
    <div>
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      )
      :
      (
        <h1>Login to upload</h1>
      )}
      </div>
      </center>
    </div>
  );
}

export default App;
