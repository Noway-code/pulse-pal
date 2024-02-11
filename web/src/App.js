import logo from './logo.svg';
import { useState, useEffect } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import icon from "./img/uploadicon.png";
import { PizZip } from 'pizzip';
import { Docxtemplater } from 'docxtemplater';
import { xmlParser } from 'xmlparser';
import 'pdfjs-dist';

function App() {
  //file vars
  const [file, setFile] = useState(null);
  const [filerad, setFileRad] = useState([]);
  const [userId, setUserId] = useState([]);
  const [contextinfo, setContextinfo] = useState(null);

  //summary vars
  const [summary, setSummary] = useState(null);


  const addFiles = (files) => {
    console.log(files);
    setFile(files);
    // processing for EHC
  }

  const addFilesRad = (files) => {
    console.log(files);
    setFileRad(files);
    // processing for Rad
  }

  const submitInfo = () => {
    const ary = [...file]
    ary.reduce((p, f) => {
      return p.then(_ => fetch("http://100.66.9.141:5000/upload-pdf", {
        method: 'POST',
        body: f,
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          console.log("pls");
          alert(`File ${f.name} uploaded successfully. Summary is:  "${data.message}"`);
          setContextinfo(ctxt => ctxt + data.message);

        })
      );
    }, Promise.resolve());
    summarize();

  }
  async function summarize(){
    const systemMessage = {
      role: "system",
      //content: "Answer like you are a pirate",
      content: "summarize this content" + contextinfo,
    }
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage
      ]
    }
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      setSummary(data.choices[0].message.content);
      /*
      console.log(data);
      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "PulsePal",
        }]
      );
      setTyping(false);*/
    });
  }
  //chat vars
  const API_KEY = process.env.REACT_APP_API_KEY;
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am an AI helper. Ask me about this patient",
      sender: "PulsePal"
    }
  ]);
  const [typing, setTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    }

    const newMessages = [...messages, newMessage]; // all old msgs + new

    // update our messages state
    setMessages(newMessages);

    //typing indicator
    setTyping(true);

    //process message to GPT
    await processMessageToChatGPT(newMessages)

  }

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "PulsePal") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message }
    });

    const systemMessage = {
      role: "system",
      //content: "Answer like you are a pirate",
      content: "You are talking to a doctor or nurse. Answer the user's questions by referencing the Electronic Medical Records Data. Assume the user is talking about the patient discussed in the Electronic Medical Record. Be direct. Here is the Electronic Medical Record: " + contextinfo,
    }
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "PulsePal",
        }]
      );
      setTyping(false);
    });
  }

  return (

    <div className="App">
      <header className="App-header">


        <div>
          <h2>Clinician Portal</h2>
          <input
            className="userIdInput"
            type="text"
            value={userId} // Bind input value to state variable
            onChange={(event) => setUserId(event.target.value)} // Update state variable inline
            placeholder="Enter Patient ID..."
          />

          <button onClick={submitInfo} style={{cursor:'pointer'}}>Submit</button>
          <h4 style={{ color: '#61dafb' }}>EHR</h4>
          <label className="uploadiconcontainer" for="file-upload">
            <img src={icon} className="uploadicon" alt="Upload File" />
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={(e) => addFiles(e.target.files)}
            style={{ display: "none" }}
          ></input>

          <h4 style={{ color: 'gray' }}>Radiology Report</h4>
          <label className="uploadiconcontainerrad" for="file-upload">
            <img src={icon} className="uploadiconrad" alt="Upload File" />
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={(e) => {
              console.log(e);
              addFilesRad(e.target.files);
            }}
            style={{ display: "none" }}
          ></input>

        </div>
        {summary ? (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '60%' }}>
            <div>
              <h2>Record Summary</h2>
              <p className="summarycontainer">{summary}</p>
            </div>
            <div className="chatboxcontainer">
              <h2>AI Helper</h2>
              <MainContainer style={{ border: "none", borderRadius: "15px", backgroundColor: "#1f2126", height: "70vh" }}>
                <ChatContainer style={{ border: "none", backgroundColor: "#1f2126" }}>
                  <MessageList style={{ backgroundColor: "#1f2126", border: "none" }}
                    typingIndicator={typing ? <TypingIndicator style={{ border: "none", backgroundColor: "#1f2126" }} content="Pulse Pal is typing" /> : null}
                  >
                    {messages.map((message, i) => {
                      return <Message key={i} model={message} />
                    })}
                  </MessageList>
                  <MessageInput placeholder='Enter Prompt...' onSend={handleSend} style={{ backgroundColor: "#1f2126", border: "none" }}></MessageInput>
                </ChatContainer>
              </MainContainer>
            </div>
          </div>
        ) : (<div style={{display:"none"}}></div>)
        }
      </header>

    </div>
  );

}

export default App;
