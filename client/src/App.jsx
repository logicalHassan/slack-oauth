import { useEffect, useState } from "react";

function App() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [teamName, setTeamName] = useState("");

  const handleAddToSlack = () => {
    const slackAuthUrl = "http://localhost:3000/auth/slack";
    window.open(slackAuthUrl, "_blank", "width=500,height=600");
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "slack-auth-success") {
        const { userId, teamId, teamName } = event.data.payload;
        console.log("Slack authentication successful!", { userId, teamId, teamName });

        // Update state to reflect successful installation
        setIsInstalled(true);
        setTeamName(teamName);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="App">
      <h1>Install Slack App</h1>
      <button onClick={handleAddToSlack}>
        {isInstalled ? (
          <>
            <span>Added to {teamName}</span>
            <span> ✔️</span>
          </>
        ) : (
          "Add to Slack"
        )}
      </button>
    </div>
  );
}

export default App;
