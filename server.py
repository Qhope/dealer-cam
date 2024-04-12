import asyncio
import websockets
import cv2
import base64
import numpy as np
import time

async def server(websocket, path):
    cv2.namedWindow("Image", cv2.WINDOW_NORMAL)
    message_count = 0
    start_time = time.time()

    while True:
        try:
            message = await websocket.recv()
            # remove data:image/jpeg;base64, in the beginning of the message
            message = message.split(",")[1]
            # Decode the base64 string to bytes
            image_bytes = base64.b64decode(message)
            
            # Convert the bytes to numpy array
            image_array = np.frombuffer(image_bytes, dtype=np.uint8)
            
            image_array = np.reshape(image_array, (-1, 1))
            # Reshape the numpy array
            # Decode the numpy array to an image
            image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            
            # Display the image in the cv2 window
            cv2.imshow("Image", image)
            
            # Update the cv2 window
            cv2.waitKey(1)
            
            # Increment the message count
            message_count += 1
            
            # Check if 1 second has passed
            if time.time() - start_time >= 1:
                print("Number of messages received in 1 second:", message_count)
                # Reset the message count and start time
                message_count = 0
                start_time = time.time()
                
        except websockets.exceptions.ConnectionClosed:
            print("Client disconnected")
            break

    cv2.destroyAllWindows()

start_server = websockets.serve(server, "localhost", 8000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()