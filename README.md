# Slack OAuth

This repo shows how to use Slack's OAuth 2.0 flow to authenticate and authorize the app in a user's workspace.

---

## **How Slack OAuth Works**

Slack OAuth is **not for individual user registration** like Google or GitHub OAuth. Instead, it is used to **add an app to a Slack workspace** and grant it permissions to access workspace data (e.g., messages, channels, users).

### **Key Differences**

- **Slack OAuth**: Used to install an app in a workspace and grant it permissions.
- **Google/GitHub OAuth**: Used for individual user registration and authentication.

---

## **How to Set Up the Project**

You can add more scopes and configure it later as you want but this is the step-by-step guide for basic configuration

### **1. Create a Slack App**

1. Go to the [Slack API](https://api.slack.com/apps) and click **Create New App**.
2. Choose **From scratch**, give your app a name, and select the workspace where you want to develop the app.

### **2. Configure OAuth & Permissions**

1. Under **OAuth & Permissions**, set the **Redirect URL** to `http://your_app_domain/auth/slack/callback` (Local URL will not work, try ngrok or port forwarding).
2. Add the following **Bot Token Scopes**:
   - `channels:history` (read public channel messages)
   - `groups:history` (read private channel messages)
   - `im:history` (read direct messages)
   - `mpim:history` (read group direct messages)
3. Add the following **User Token Scopes** (optional):
   - `users:read` (read user information).

### **3. Install the App to Your Workspace**

1. Under **OAuth & Permissions**, click **Install to Workspace**.
2. Authorize the app in your workspace. This will generate a **Bot User OAuth Token** and a **User OAuth Token**.

### **4. Make the App Distributed (Public)**

1. Under **Settings > Manage Distribution**.
   - Fill in the required details (e.g., app name, description, icon).
2. Under **Distribution**, click **Activate Public Distribution**.
3. Submit your app for Slack's review.
   - Provide details about your app, including scopes, use cases, and screenshots.
4. Once approved, your app can be installed in any workspace.

---

## **How to Run the Project**

### **1. Clone the Repository**

```bash
git clone https://github.com/logicalHassan/slack-oauth.git
```

### **2. Set up environment vaiables**

Create a .env file in the root directory and add the following:

```bash
SLACK_CLIENT_ID=your-client-id
SLACK_CLIENT_SECRET=your-client-secret
APP_REDIRECT_URL=https://your_domain.com/auth/slack/callback
```

### **3. Run the project**

Just run the following scripts, the dependencies will be installed automatically

```bash
npm run server
npm run client
```

```

```
