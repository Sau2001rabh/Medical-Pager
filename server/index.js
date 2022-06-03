const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.js');

const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid, authToken);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get( '/', (req, res) => {
    res.send('Hello,World!');
});

app.post('/', (req, res) => {
    const { message, user: sender, type, members } = req.body;

    if(type=='message.new'){
        members
        .forEach(({ user }) => {
            if(!user.online) {
                twilioClient.messages.create({
                    body: 'You have a new message from ${message.user.fullname} - ${message.text}',
                    messagingServiceSid
                })
            }
        })
    }
})

app.use('/auth', authRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));