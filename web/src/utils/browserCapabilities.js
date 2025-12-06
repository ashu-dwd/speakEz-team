/**
 * Browser Capabilities Utility
 * Detects browser support for Speech Recognition (STT) and Text-to-Speech (TTS)
 */

/**
 * Check if browser supports Speech Recognition (STT)
 * @returns {Object} { supported: boolean, message: string }
 */
export const checkSpeechRecognitionSupport = () => {
  const hasSTT =
    "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
  return {
    supported: hasSTT,
    message: hasSTT
      ? "Speech recognition is supported"
      : "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.",
  };
};

/**
 * Check if browser supports Speech Synthesis (TTS)
 * @returns {Object} { supported: boolean, message: string }
 */
export const checkSpeechSynthesisSupport = () => {
  const hasTTS = "speechSynthesis" in window;
  return {
    supported: hasTTS,
    message: hasTTS
      ? "Text-to-speech is supported"
      : "Text-to-speech is not supported in your browser. Please use a modern browser with TTS support.",
  };
};

/**
 * Check all required browser capabilities for interview
 * @returns {Object} {
 *   allSupported: boolean,
 *   stt: { supported, message },
 *   tts: { supported, message },
 *   unsupportedFeatures: string[]
 * }
 */
export const checkInterviewCapabilities = () => {
  const stt = checkSpeechRecognitionSupport();
  const tts = checkSpeechSynthesisSupport();

  const unsupportedFeatures = [];
  if (!stt.supported) unsupportedFeatures.push("Speech Recognition (STT)");
  if (!tts.supported) unsupportedFeatures.push("Text-to-Speech (TTS)");

  return {
    allSupported: stt.supported && tts.supported,
    stt,
    tts,
    unsupportedFeatures,
  };
};
