const axios = require('axios');

module.exports = async (req, res) => {
    // Sirf POST request allow karein
    if (req.method !== 'POST') {
        return res.status(405).json({ status: false, reason: "Method Not Allowed" });
    }

    try {
        const targetUrl = 'http://adminpanel1.free.je/connect';
        
        // Loader se aane wale data ko map karna
        let incomingData = req.body;
        
        // Agar data string format me hai toh usko parse karne ki koshish karein
        if (typeof incomingData === 'string') {
            try { incomingData = JSON.parse(incomingData); } catch(e) {}
        }

        // URLSearchParams se data ko explicit encode karna jo CodeIgniter easily detect kar sake
        const params = new URLSearchParams();
        params.append('game', incomingData.game || 'PUBG');
        params.append('user_key', incomingData.user_key || '');
        params.append('serial', incomingData.serial || incomingData.serial || '');

        const response = await axios.post(targetUrl, params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            },
            timeout: 10000
        });

        let responseData = response.data;

        // Agar response abhi bhi HTML text hai, toh filter catch alert dega
        if (typeof responseData === 'string' && responseData.includes('<!DOCTYPE html>')) {
            return res.status(200).json({ 
                status: false, 
                reason: "Panel formatting error: Received HTML instead of JSON response." 
            });
        }

        if (typeof responseData === 'string') {
            try { responseData = JSON.parse(responseData); } catch (e) {}
        }

        return res.status(200).json(responseData);

    } catch (error) {
        return res.status(200).json({ status: false, reason: "Proxy Pipeline Error: " + error.message });
    }
};
