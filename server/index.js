const express = require("express");
const axios = require("axios");
const app = express();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.APP_REDIRECT_URL;

app.get("/", async (req, res) => {
  res.send("Hello Server");
});

//* STEP: 1 --> Redirect users to Slack's OAuth page
app.get("/auth/slack", (req, res) => {
  const scopes = "channels:history,groups:history,im:history";
  const userScope = "&users:read";
  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&user_scope=${userScope}&redirect_uri=${redirectUri}`;
  res.redirect(slackAuthUrl);
});

//* STEP: 2 --> Handle OAuth callback
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

// Handle disconnect
app.post("/auth/slack/disconnect", async (req, res) => {
  const { teamId } = req.body;

  try {
    // Fetch the tokens from your database (** use your db adapter for querying **)
    const tokens = await db.collection("tokens").findOne({ teamId });

    if (!tokens) {
      return res.status(404).json({ success: false, error: "No tokens found for this team" });
    }

    // Revoke the tokens using Slack's API
    await axios.post("https://slack.com/api/auth.revoke", null, {
      params: {
        token: tokens.accessToken,
      },
    });

    // Remove the tokens from your database
    await db.collection("tokens").deleteOne({ teamId });

    res.json({ success: true });
  } catch (error) {
    console.error("Error during disconnect:", error);
    res.status(500).json({ success: false, error: "Failed to disconnect" });
  }
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at http://localhost:${port}`);
});
