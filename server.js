const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__(__dirname, 'public'))));

// Endpoint API Gateway Anda (nanti diganti dengan URL API Gateway yang asli saat lomba)
const API_GATEWAY_URL = process.env.API_URL || 'https://abv7urx904.execute-api.us-east-1.amazonaws.com/prod/book-ticket';

// Route utama untuk menyajikan halaman Frontend E-Commerce
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route backend for frontend (BFF) - meneruskan request dari frontend ke API Gateway / AWS Step Functions
app.post('/api/book-ticket', async (req, res) => {
    try {
        const { customer_name, ticket_type } = req.body;
        
        // Meneruskan request pemesanan ke arsitektur Serverless (API Gateway AWS)
        // Saat lomba, pastikan API_GATEWAY_URL sudah diisi
        const response = await axios.post(API_GATEWAY_URL, {
            customer_name,
            ticket_type
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error calling API Gateway:", error.message);
        res.status(500).json({ 
            error: "Gagal memproses tiket. Pastikan API Gateway AWS sudah aktif.", 
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Frontend Node.js app listening on port ${PORT}`);
    console.log(`Pastikan Environment Variable API_URL di-set agar dapat menyambung ke Lambda / Step Functions.`);
});
