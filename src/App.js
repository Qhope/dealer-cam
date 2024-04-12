import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
// import WebSocket from 'websocket';

let ws;
function App() {
  const webcamRef = useRef(null);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    // Connect to WebSocket server
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const ip = process.env.REACT_APP_IP || "localhost";
    const port = process.env.REACT_APP_PORT || "8000";
    ws = new WebSocket(`ws://${ip}:${port}`);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onclose = (message,error,code) => {
      console.log("Disconnected from WebSocket server: ",message, " error: ", error, " code: ", code);
    };

    return () => {
      // Clean up WebSocket connection
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const startStream = () => {
    ws.send("start");
    const interId = setInterval(() => {
      const imageSrc = webcamRef.current.getScreenshot();

      ws.send(imageSrc);
    }, 1000 / 24);
    setIntervalId(interId);
  };
  const stopStream = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      ws.send("stop")
    }
  };
  const sentOneFrame = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    ws.send(imageSrc);
  };

  return (
    <div className="App">
      <h1>Video Streaming App</h1>
      <div>
        <Webcam
          audio={false}
          ref={webcamRef}
          width={640}
          height={480}
          screenshotFormat="image/jpeg"
        />
      </div>
      <button onClick={sentOneFrame}>Sent one frame</button>
      <button onClick={startStream}>Start stream</button>
      <button onClick={stopStream}>Stop stream</button>
    </div>
  );
}

export default App;
