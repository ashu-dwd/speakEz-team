import React from "react";

const GrammarNotes = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📘 SpeakEZ Grammar Notes</h1>
      <p className="mb-6">Welcome to the SpeakEZ Grammar Hub! Here you'll find simple, clear explanations of key grammar topics to boost your speaking and writing skills.</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">🔤 Parts of Speech</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Nouns</strong> – Name people, places, things, or ideas. <em>e.g., teacher, city, phone, freedom</em></li>
          <li><strong>Verbs</strong> – Show action or state. <em>e.g., run, speak, is, have</em></li>
          <li><strong>Adjectives</strong> – Describe nouns. <em>e.g., happy, tall, beautiful</em></li>
          <li><strong>Adverbs</strong> – Modify verbs, adjectives, or other adverbs. <em>e.g., quickly, very, well</em></li>
          <li><strong>Pronouns</strong> – Replace nouns. <em>e.g., he, she, it, they</em></li>
          <li><strong>Prepositions</strong> – Show relationships in time or space. <em>e.g., in, on, under, before</em></li>
          <li><strong>Conjunctions</strong> – Connect words or groups of words. <em>e.g., and, but, because</em></li>
          <li><strong>Interjections</strong> – Express emotion. <em>e.g., wow, oh, ouch!</em></li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">🧩 Sentence Structure</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Simple Sentence:</strong> One independent clause. <em>She runs every morning.</em></li>
          <li><strong>Compound Sentence:</strong> Two independent clauses joined by a conjunction. <em>I wanted tea, but she made coffee.</em></li>
          <li><strong>Complex Sentence:</strong> One independent clause and one or more dependent clauses. <em>Because it was raining, we stayed indoors.</em></li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">⏳ Tenses Overview</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Present Simple:</strong> Facts and routines. <em>She works at a bank.</em></li>
          <li><strong>Past Simple:</strong> Completed actions. <em>They visited Paris last year.</em></li>
          <li><strong>Future Simple:</strong> Future plans or predictions. <em>I will call you tomorrow.</em></li>
          <li><strong>Present Perfect:</strong> Actions with relevance to the present. <em>I have finished my homework.</em></li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">✅ Common Grammar Tips</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Use <strong>"a"</strong> before consonant sounds and <strong>"an"</strong> before vowel sounds. <em>a dog, an apple</em></li>
          <li><strong>Its</strong> = possessive | <strong>It’s</strong> = it is. <em>The cat licked its paw. / It’s raining.</em></li>
          <li>Avoid double negatives:<br/> ❌ <em>I don’t need no help.</em> <br/> ✅ <em>I don’t need any help.</em></li>
        </ul>
      </section>
    </div>
  );
};

export default GrammarNotes;
