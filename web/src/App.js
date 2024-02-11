import logo from './logo.svg';
import {useState, useEffect} from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react";
import icon from "./img/uploadicon.png";
function App() {
  //file vars
  const[file, setFile] = useState([]);
  const[userId, setUserId] = useState([]);

  //summary vars
  const[summary, setSummary] = useState("Martha Steel is a female patient with the patient identifier ABC123. She was born on October 13, 2001. Her contact information is as follows: Address- 123 Sample Street, Sample City, AZ 12345, Contact numbers- Janet Steel (mother) - 555-5555, Susan Steel (sister) - 555-5555. Martha is covered by A1 Insurers Comprehensive Plan, and the contact number for insurance is 555-5555. Her insurance policy number is 12345. Martha has a history of Graves' disease, which was treated with a thyroidectomy in 2021. She currently manages her condition with levothyroxine. Dr. Max Smith is Martha's family doctor. The contact number for Family Doctors is 555-5555, and their address is 26 Sample Terrace. Dr. Ella Lee is an endocrinologist who is involved in Martha's care. The contact number for Dr. Ella Lee is 555-5555, and their address is Sample Specialist Centre, 123 Sample Road. Ms. Lena Yip is an ENT surgeon who performed Martha's thyroidectomy in 2021. The contact number for Ms. Lena Yip is 555-5555. Martha has received vaccinations for Covid-19, including a booster dose. She is currently taking levothyroxine, with a dose of 25mg daily. She has also received the Hepatitis B vaccine (Engerix-B) in May 2020. There are no additional notes or information provided in the report. It is worth noting that Martha has a smoking habit, as mentioned in the report");


  const addFiles = (files) => {
    setFile(files);
    console.log("bro");
    console.log(files);
    console.log("bro");
  }

  //chat vars
  const contextinfo = "Martha Steel is a female patient with the patient identifier ABC123. She was born on October 13, 2001. Her contact information is as follows: Address- 123 Sample Street, Sample City, AZ 12345, Contact numbers- Janet Steel (mother) - 555-5555, Susan Steel (sister) - 555-5555. Martha is covered by A1 Insurers Comprehensive Plan, and the contact number for insurance is 555-5555. Her insurance policy number is 12345. Martha has a history of Graves' disease, which was treated with a thyroidectomy in 2021. She currently manages her condition with levothyroxine. Dr. Max Smith is Martha's family doctor. The contact number for Family Doctors is 555-5555, and their address is 26 Sample Terrace. Dr. Ella Lee is an endocrinologist who is involved in Martha's care. The contact number for Dr. Ella Lee is 555-5555, and their address is Sample Specialist Centre, 123 Sample Road. Ms. Lena Yip is an ENT surgeon who performed Martha's thyroidectomy in 2021. The contact number for Ms. Lena Yip is 555-5555. Martha has received vaccinations for Covid-19, including a booster dose. She is currently taking levothyroxine, with a dose of 25mg daily. She has also received the Hepatitis B vaccine (Engerix-B) in May 2020. There are no additional notes or information provided in the report. It is worth noting that Martha has a smoking habit, as mentioned in the report."
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

  async function processMessageToChatGPT(chatMessages){
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if(messageObject.sender === "PulsePal"){
        role="assistant";
      } else {
        role ="user";
      }
      return { role: role, content: messageObject.message }
    });

    const systemMessage = {
      role: "system",
      //content: "Answer like you are a pirate",
      content: "You are talking to a doctor or nurse. Answer the user's questions by referencing the Electronic Medical Records Data. Assume the user is talking about the patient discussed in the Electronic Medical Record. Be direct. Here is the Electronic Medical Record: " + contextinfo,
    }
    const apiRequestBody = {
      "model" : "gpt-3.5-turbo",
      "messages" : [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization" : "Bearer " + API_KEY,
        "Content-Type" : "application/json",
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) =>{
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
    
      <label className="uploadiconcontainer" for="file-upload">
          <img src={icon} className="uploadicon" alt="Upload File" />
      </label>
        <input 
          id="file-upload"
          type="file"
          multiple
          onChange = {(e) => addFiles(e.target.files)}
          style = {{display:"none"}}
        ></input>
      </div>
      <div >
        <h2>Record Summary</h2>
        <p className="summarycontainer">{summary}</p>
      </div>
      <div className="chatboxcontainer">
        <MainContainer style={{border:"none", borderRadius: "15px", backgroundColor:"#1f2126", height: "70vh"}}>
          <ChatContainer style={{border:"none", backgroundColor:"#1f2126"}}>
            <MessageList style={{backgroundColor:"#1f2126", border:"none"}}
              typingIndicator={typing ? <TypingIndicator style={{border:"none", backgroundColor:"#1f2126"}} content="Pulse Pal is typing"/> : null }
            >
              { messages.map((message, i) => {
                return <Message key={i} model={message} />
              }) }
            </MessageList>
            <MessageInput placeholder='Enter Prompt...' onSend= {handleSend} style={{backgroundColor:"#1f2126", border:"none"}}></MessageInput>
          </ChatContainer>
        </MainContainer>
      </div>
      </header>

    </div>
  );

}

export default App;
