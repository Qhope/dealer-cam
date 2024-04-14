import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
// import WebSocket from 'websocket';

let ws;
function App() {
  const webcamRef = useRef(null);
  const [intervalId, setIntervalId] = useState(null);
  const [frameRate, setFrameRate] = useState(24);

  useEffect(() => {
    // Connect to WebSocket server
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log(
      "process.env",
      process.env.REACT_APP_WS_IP,
      process.env.REACT_APP_WS_PORT,
      process.env
    );
    const ip = process.env.REACT_APP_WS_IP || "localhost";
    const port = process.env.REACT_APP_WS_PORT || "8000";
    ws = new WebSocket(`ws://${ip}:${port}`);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onclose = (message, error, code) => {
      console.log(
        "Disconnected from WebSocket server: ",
        message,
        " error: ",
        error,
        " code: ",
        code
      );
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
      ws.send("stop");
    }
  };

  return (
    <div className="App">
      <h1>Video Streaming App</h1>
      <div className="video-wrapper">
        <div className="video">
          <Webcam
            audio={false}
            ref={webcamRef}
            width={1280}
            height={720}
            screenshotFormat="image/jpeg"
          />
        </div>
        <div className="control">
          <h2>Controls</h2>
          <input
            type="number"
            placeholder="Enter frame rate"
            onChange={(evt) => {
              const { value } = evt.target;
              if (value) {
                setFrameRate(Number(value));
              }
            }}
            defaultValue={frameRate}
          />
          <br />
          <h2>Actions</h2>
          <button onClick={startStream}>Start stream</button>
          <button onClick={stopStream}>Stop stream</button>
        </div>
      </div>
    </div>
  );
}

export default App;
