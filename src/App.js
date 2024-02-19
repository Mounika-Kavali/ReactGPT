import React, { useState } from "react";
import ChatbotUI from "./components/ChatbotUI";
import InteractiveBotUI from "./components/InteractiveBotUI";
import { AppProvider } from "./context/AppContext";

function App() {
  const [isInteractive, setIsInteractive] = useState(false);

  const toggleCheckbox = () => {
    setIsInteractive(!isInteractive);
  };

  return (
    <div className="App">
      <AppProvider>
        <label>
          Interactive Response
          <input
            type="checkbox"
            checked={isInteractive}
            onChange={toggleCheckbox}
          />
        </label>
        {isInteractive ? <InteractiveBotUI /> : <ChatbotUI />}
      </AppProvider>
    </div>
  );
}

export default App;
