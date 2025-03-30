// import { useEffect, useState } from 'react';

// export function useWebSocket(url, onMessage) {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const ws = new WebSocket(url);
    
//     ws.onopen = () => {
//       console.log('WebSocket connected');
//       setSocket(ws);
//     };

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       onMessage(data);
//     };

//     ws.onclose = () => {
//       console.log('WebSocket disconnected');
//       setSocket(null);
//     };

//     return () => {
//       ws.close();
//     };
//   }, [url, onMessage]);

//   return socket;
// }