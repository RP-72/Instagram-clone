import { Button } from '@material-ui/core';
import React, {useState, useEffect} from 'react'
import {storage, db } from "./firebase"
import firebase from 'firebase'
import './imageupload.css'

function ImageUpload({username}) {
    const [image,setImage] = useState(null);
    const [caption,setCaption] = useState("");
    const [progress,setProgress] = useState(0);
    
    const handleChange = (e) =>{
        if(e.target.files[e.target.files.length - 1]){
            setImage(e.target.files[e.target.files.length - 1])
        }
    }
    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      };
    const handleUpload = () =>{
        var date = new Date();
        var time = date.getTime().toString();
        const uploadTask = storage.ref(`images/${time}`)
        .put(image);
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                const progress1 = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes) * 100
                )
                setProgress(progress1);
            },
            (error) =>{
                console.log(error)
                alert(error.message)
            },
            () =>{
                storage
                .ref("images")
                .child(`${time}`)
                .getDownloadURL()
                .then(url =>{
                        db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption : caption,
                        imageUrl: url,
                        username: username
                    })
                })
                setProgress(0);
                setImage(null)
                setCaption("")
            }
        )
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        
          });
    }

    return (
        <div className="imageupload">
            <progress value={progress} max="100" className="imageupload__progress"/>
             <input 
                 type="text" 
                 placeholder="Enter caption here" 
                 onChange={(e) => setCaption(e.target.value)}
                 value={caption} 
                 style={{padding:'20px'}}
             />
             <input 
                 type="file"
                 onChange={handleChange}
             />
             {
                 image ?
                 (
                    <Button onClick={handleUpload}>
                        Upload
                    </Button>
                 )
                 :
                 (
                    <h3>Select an image you want to upload</h3>
                 )
             }
             
        </div>
    )
}

export default ImageUpload
