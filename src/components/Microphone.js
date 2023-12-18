import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import MicIcon from "@material-ui/icons/Mic";

const Microphone = ({ onSpeechResult }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript !== "") {
      onSpeechResult(transcript);
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleMicClick = () => {
    if (listening) {
      let pauseTimeout = setTimeout(() => {
        SpeechRecognition.stopListening();
      }, 8000);

      return () => {
        // Clear the timeout if the component unmounts or if the user resumes speaking
        clearTimeout(pauseTimeout);
      };
    } else {
      SpeechRecognition.startListening();
    }
  };

  return (
    <div>
      <div
        className={` ${listening ? "micOn" : "micOff"}`}
        onClick={handleMicClick}
      >
        <MicIcon />
      </div>
    </div>
  );
};
export default Microphone;
