import "./App.css";

// v9 compat packages are API compatible with v8 code
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useRef, useState } from "react";

firebase.initializeApp({
  apiKey: "AIzaSyC88qgiFqnjWGAUJ0Kwjflu49Baqm6U3DU",
  authDomain: "uwu-chat-f32ed.firebaseapp.com",
  projectId: "uwu-chat-f32ed",
  storageBucket: "uwu-chat-f32ed.appspot.com",
  messagingSenderId: "593492786534",
  appId: "1:593492786534:web:8997126c8d2e1692de5ca7",
  measurementId: "G-64HNNQZY88",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header></header>
      <section>{user ? <ChatRoom /> : <SingIn />}</section>
    </div>
  );
}

function SingIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Sing in with Google</button>;
}

function SingOut() {
  return (
    auth.currentUser && (
      <button onClick={() => auth.singOuth()}>Sing Out</button>
    )
  );
}

//DB reference
function ChatRoom() {
  const dummy = useRef();

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  //listen data
  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");

    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={formValue}
          onChange={(e) => {
            setFormValue(e.target.value);
          }}
        />
        <button type="submit" disabled={!formValue}>
          {" "}
          📤
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={` message ${messageClass} `}>
      <img src={photoURL} alt="user" />
      <p> {text} </p>
    </div>
  );
}

export default App;
