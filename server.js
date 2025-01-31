const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

const clientId = "8351298564167.8363031493781";
const clientSecret = "4744f74225bbdfc3832a1ae94b3aa871";
const redirectUri = "https://40sczldl-3000.inc1.devtunnels.ms/auth/slack/callback";

app.get("/", async (req, res) => {
  res.send("Hello Server");
});

// Redirect users to Slack's OAuth page
app.get("/auth/slack", (req, res) => {
  const scopes = "channels:history,groups:history,im:history";
  const userScope = "&users:read";
  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&user_scope=${userScope}&redirect_uri=${redirectUri}`;
  res.redirect(slackAuthUrl);
});

// Handle OAuth callback
app.get("/auth/slack/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange the code for tokens
    const response = await axios.post("https://slack.com/api/oauth.v2.access", null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      },
    });

    const { authed_user, access_token, bot_user_id, bot_access_token, team } = response.data;
    console.log("🚀 ~ app.get ~ data:", response.data);
    console.log("🚀 ~ app.get ~ authed_user:", authed_user);

    // Save tokens to your database (example using a simple object)
    const tokens = {
      userId: authed_user.id,
      teamId: team.id,
      accessToken: access_token,
      botToken: bot_access_token,
    };
    console.log("Tokens saved:", tokens);

    // Return a simple HTML page to close the pop-up and notify the main app
    res.send(`
    <html>
      <body>
        <script>
          window.opener.postMessage({ type: 'slack-auth-success', payload: { userId: '${authed_user.id}', teamId: '${team.id}' } }, '*');
          window.close();
        </script>
      </body>
    </html>
  `);
  } catch (error) {
    console.error("Error during OAuth callback:", error);
    res.status(500).send("Authentication failed");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

//* ---> For disconnecting the app, delete the stored token and revoke it

// app.post('/auth/slack/disconnect', async (req, res) => {
//     const { teamId } = req.body; // Assuming you pass the teamId from the frontend

//     try {
//       // Fetch the tokens from your database
//       const tokens = await db.collection('tokens').findOne({ teamId });

//       if (!tokens) {
//         return res.status(404).json({ success: false, error: 'No tokens found for this team' });
//       }

//       // Revoke the tokens using Slack's API
//       await axios.post('https://slack.com/api/auth.revoke', null, {
//         params: {
//           token: tokens.accessToken, // Use the user token or bot token
//         },
//       });

//       // Remove the tokens from your database
//       await db.collection('tokens').deleteOne({ teamId });

//       res.json({ success: true });
//     } catch (error) {
//       console.error('Error during disconnect:', error);
//       res.status(500).json({ success: false, error: 'Failed to disconnect' });
//     }
//   });
