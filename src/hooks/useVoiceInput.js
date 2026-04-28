import { useState, useRef, useCallback } from "react";

export function useVoiceInput(onResult) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    setTimeout(() => {
      setIsRecording(false);
      clearInterval(timerRef.current);
      setRecordingTime(0);
      onResult("Где моя посылка с трек-номером 284759163?");
    }, 3500);
  }, [onResult]);

  const cancelRecording = useCallback(() => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    setRecordingTime(0);
  }, []);

  const sendRecording = useCallback(() => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    setRecordingTime(0);
    onResult("Где моя посылка с трек-номером 284759163?");
  }, [onResult]);

  return {
    isRecording,
    recordingTime,
    formattedTime: formatTime(recordingTime),
    startRecording,
    cancelRecording,
    sendRecording,
  };
}
