import ChatbotUI from "./components/ChatbotUI";
import InteractiveBotUI from "./components/InteractiveBotUI";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <div className="App">
      <AppProvider>
      {/* <ChatbotUI/> */}
      <InteractiveBotUI/>
      </AppProvider>
    </div>
  );
}

export default App;
