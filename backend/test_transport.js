const axios = require('axios');

async function testTransport() {
    try {
        console.log('Testing Transport API...');
        const response = await axios.post('http://localhost:3000/api/transport', {
            origin: 'Berlin, Germany',
            destination: '28001'
        });
        console.log('Success!', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testTransport();
