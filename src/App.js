import "./App.css";
import { useState } from "react";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {CognitoUser,AuthenticationDetails} from "amazon-cognito-identity-js";
import UserPool from "./UserPool";

let idTokenlo;
function App() {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState("");
  const [LoginRes, setLoginRes] = useState("");
  const [idToken, setIdToken] = useState(null);

  const email="abadeer@hotmail.com"
  const password="abadir_2000"    
  const region = "us-east-1";
  const identitypoolid = "us-east-1:2b404e3d-6bdf-404a-8f21-701f364fb12f";
  const albumBucketName = "lostpictures";


  
  const onFileUpload = (e) => {
    setFile(e.target.files[0]);
  };
  
  const onSubmit=(event)=>{
        event.preventDefault();

        const user = new CognitoUser({
          Username: email,
          Pool: UserPool,
        });
        
        const authDetails = new AuthenticationDetails({
          Username: email,
          Password: password,
        });
        
        user.authenticateUser(authDetails, {
          onSuccess: (data) => {
            console.log("onSuccess: ", data);
            idTokenlo=data.idToken.jwtToken;
            
            setIdToken(JSON.stringify(data.getIdToken()));
            setLoginRes(JSON.stringify(data.idToken.jwtToken));
          },
          onFailure: (err) => {
            console.error("onFailure: ", err);
            setLoginRes(JSON.stringify(err));
          },
          newPasswordRequired: (data) => {
            console.log("newPasswordRequired: ", data);
          },
        });
      }


      
       const s3 = new S3Client({
        region: region,
        credentials: fromCognitoIdentityPool({
          client: new CognitoIdentityClient({ region: region }),
          identityPoolId: identitypoolid,
          logins:{
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_nASW5MZW5':idTokenlo,
          }
        }),
        
      });


  async function onPicUpload() {
    console.log(idTokenlo);
  const uploadParams = {
    Bucket: albumBucketName,
    Key: "peterUploaded",
    Body: file,
    
  };
  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    setRes(JSON.stringify(data));
    console.log(data);
  } catch (err) {
    setRes(JSON.stringify(err));
    return console.log("There was an error uploading your photo: ", err);
    
  }
}
  return (
    <div className="App">
      <input type="file" onChange={(e) => onFileUpload(e)} />
      <button onClick={() => onPicUpload()}> upload</button>
      <div> upload img data: 
      <br/>


      {res}
      <br/>
      </div>
      <br />

      <div>
            <button onClick={(e)=>{onSubmit(e)}}> login </button>
            login data:
            <br/>
            {idToken}
        </div>
    </div>
  );
}

export default App;
