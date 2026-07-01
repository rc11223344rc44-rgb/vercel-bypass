const axios = require('axios');
const qs = require('qs'); // URL encoding ke liye standard library

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: false, reason: "Method Not Allowed" });
    }

    try {
        const targetUrl = 'http://adminpanel1.free.je/connect';
        
        // Loader se aaye data ko proper application/x-www-form-urlencoded string me badalna
        const formData = qs.stringify(req.body);

        const response = await axios.post(targetUrl, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/html, */*'
            },
            timeout: 10000
        });

        let responseData = response.data;

        // Check karo agar abhi bhi panel HTML error bhej raha hai
        if (typeof responseData === 'string' && responseData.includes('<!DOCTYPE html>')) {
            return res.status(200).json({ 
                status: false, 
                reason: "Panel rejected formatting. Verification failed on host side." 
            });
        }

        // Agar response string me JSON hai toh object banao
        if (typeof responseData === 'string') {
            try {
                responseData = JSON.parse(responseData);
            } catch (e) {
                return res.status(200).json({ status: false, reason: "Invalid response structure from panel." });
            }
        }

        return res.status(200).json(responseData);
    } catch (error) {
        return res.status(200).json({ status: false, reason: "Bypass Proxy Error: " + error.message });
    }
};
