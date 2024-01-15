import ChatbotUI from "./components/ChatbotUI";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <div className="App">
      <AppProvider>
      <ChatbotUI/>
      </AppProvider>
    </div>
  );
}

export default App;
