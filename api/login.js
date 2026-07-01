const axios = require('axios');

module.exports = async (req, res) => {
    // Vercel me sirf POST requests allow karne ke liye
    if (req.method !== 'POST') {
        return res.status(405).json({ status: false, reason: "Method Not Allowed" });
    }

    try {
        const targetUrl = 'http://adminpanel1.free.je/connect';
        
        // Axios ke jariye browser headers ke sath InfinityFree ko request forward karte hain
        const response = await axios.post(targetUrl, req.body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            },
            timeout: 8000 // 8 seconds timeout
        });

        // Asli panel ka response loader ko wapas de do
        return res.status(200).json(response.data);
    } catch (error) {
        // Agar InfinityFree side se koi dikkat aaye toh error response bhej do
        return res.status(500).json({ status: false, reason: "Bypass Proxy Error: " + error.message });
    }
};
