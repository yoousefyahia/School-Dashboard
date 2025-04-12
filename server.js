const WebSocket = require('ws');
const express = require('express');
const http = require('http');

// إعداد Express
const app = express();
const server = http.createServer(app);

// إعداد WebSocket server
const wss = new WebSocket.Server({ server });

// عند الاتصال بالـ WebSocket
wss.on('connection', (ws) => {
  console.log('A user connected');

  // استقبال الرسائل من العميل
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    // إرسال رسالة إلى جميع العملاء المتصلين
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // عند قطع الاتصال
  ws.on('close', () => {
    console.log('A user disconnected');
  });
});

// تشغيل الخادم على بورت 8080
server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
