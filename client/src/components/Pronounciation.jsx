import React from "react";

const Pronunciation = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🗣️ SpeakEZ Pronunciation Guide</h1>
      <p className="mb-6">Master English pronunciation with these essential tips and examples. Clear speech makes confident communication!</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">📌 Common Pronunciation Tips</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Silent letters:</strong> Don’t pronounce the silent letters. <em>e.g., k<strong>n</strong>ife, w<strong>r</strong>ite, col<strong>u</strong>mn</em></li>
          <li><strong>Th sounds:</strong> /θ/ (thin) and /ð/ (this) need tongue between teeth.</li>
          <li><strong>Word stress:</strong> Stress the correct syllable. <em>e.g., REcord (noun) vs. reCORD (verb)</em></li>
          <li><strong>V vs. W:</strong> V vibrates your lips, W is rounded. <em>e.g., vet vs. wet</em></li>
          <li><strong>End sounds:</strong> Don’t drop final consonants. <em>e.g., not, helped, missed</em></li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">🔡 Vowel Sounds</h2>
        <p className="mb-2">English has short and long vowel sounds. Pronouncing them correctly changes meaning:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Ship</strong> vs. <strong>Sheep</strong></li>
          <li><strong>Bit</strong> vs. <strong>Beat</strong></li>
          <li><strong>Full</strong> vs. <strong>Fool</strong></li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">🎧 Practice Suggestions</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Use language apps (like Forvo, Elsa Speak, or YouGlish) to hear native pronunciation.</li>
          <li>Record yourself and compare with native speakers.</li>
          <li>Watch movies or shows with subtitles, then repeat key phrases aloud.</li>
          <li>Practice tongue twisters to improve fluency. <em>e.g., She sells seashells by the seashore.</em></li>
        </ul>
      </section>
    </div>
  );
};

export default Pronunciation;