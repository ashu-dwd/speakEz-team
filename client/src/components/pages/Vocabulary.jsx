import React, { useEffect, useState } from "react";
import "./Vocabulary.css";

const vocabulary = [
  {
    word: "Abundant",
    meaning: "Existing or available in large quantities",
    sentence: "The forest was abundant with wildlife."
  },
  {
    word: "Brisk",
    meaning: "Quick and active",
    sentence: "She went for a brisk walk every morning."
  },
  {
    word: "Candid",
    meaning: "Truthful and straightforward",
    sentence: "He gave a candid response during the interview."
  },
  {
    word: "Diverse",
    meaning: "Showing a great deal of variety",
    sentence: "The city has a diverse culture."
  },
  {
    word: "Eloquent",
    meaning: "Fluent or persuasive in speaking or writing",
    sentence: "She gave an eloquent speech."
  },
  {
    word: "Frugal",
    meaning: "Careful in spending money",
    sentence: "They lived a frugal lifestyle."
  },
  {
    word: "Gratify",
    meaning: "Give satisfaction",
    sentence: "He was gratified by the response."
  },
  {
    word: "Harmony",
    meaning: "Agreement or concord",
    sentence: "They lived in harmony with nature."
  },
  {
    word: "Impeccable",
    meaning: "Flawless; perfect",
    sentence: "Her manners were impeccable."
  },
  {
    word: "Jubilant",
    meaning: "Feeling or expressing great joy",
    sentence: "The crowd was jubilant after the victory."
  },
  {
    word: "Keen",
    meaning: "Having or showing eagerness",
    sentence: "He was keen to learn new things."
  },
  {
    word: "Lucid",
    meaning: "Expressed clearly; easy to understand",
    sentence: "She gave a lucid explanation."
  },
  {
    word: "Modest",
    meaning: "Humble in manner or appearance",
    sentence: "He was always modest about his achievements."
  },
  {
    word: "Nimble",
    meaning: "Quick and light in movement",
    sentence: "The dancer had nimble feet."
  },
  {
    word: "Obstinate",
    meaning: "Stubborn",
    sentence: "The child was obstinate in his decision."
  },
  {
    word: "Precise",
    meaning: "Exact; accurate",
    sentence: "The instructions must be precise."
  },
  {
    word: "Quaint",
    meaning: "Attractively old-fashioned",
    sentence: "We stayed in a quaint little village."
  },
  {
    word: "Robust",
    meaning: "Strong and healthy",
    sentence: "He has a robust physique."
  },
  {
    word: "Serene",
    meaning: "Calm, peaceful",
    sentence: "The lake was calm and serene."
  },
  {
    word: "Thrive",
    meaning: "Grow or develop well",
    sentence: "Plants thrive in sunlight."
  },
  {
    word: "Unique",
    meaning: "One of a kind",
    sentence: "Her style is unique."
  },
  {
    word: "Vivid",
    meaning: "Producing strong, clear images",
    sentence: "She has a vivid imagination."
  },
  {
    word: "Witty",
    meaning: "Clever and humorous",
    sentence: "He made a witty remark."
  }
];

const VocabularyBox = () => {
  const [femaleVoice, setFemaleVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(
        (v) =>
          v.name.includes("Female") ||
          v.name.includes("Google US English") ||
          v.name.includes("Samantha")
      );
      setFemaleVoice(voice || voices[0]); // fallback to first available voice
    };

    // Some browsers load voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices(); // Try to load immediately too
  }, []);

  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="vocab-container">
      <h2>Vocabulary Box</h2>
      <div className="vocab-list">
        {vocabulary.map((item, index) => (
          <div key={index} className="vocab-card">
            <div className="word-row">
              <h3 className="word">{item.word}</h3>
              <button className="speak-btn" onClick={() => speakWord(item.word)}>
                🔊
              </button>
            </div>
            <p className="meaning"><strong>Meaning:</strong> {item.meaning}</p>
            <p className="sentence"><strong>Example:</strong> <em>{item.sentence}</em></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VocabularyBox;

