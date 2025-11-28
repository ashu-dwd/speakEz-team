import React, { useState } from "react";
import "../assets/AiCharacter.css";
import axios from "axios";

const Aicharacter = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [personality, setPersonality] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !personality || !image) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("personality", personality);
    formData.append("aiCharImg", image);

    try {
      console.log(formData);
      const res = await axios.post(
        "http://localhost:5000/api/aiChar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Character created successfully!");
      setName("");
      setDescription("");
      setPersonality("");
      setImage(null);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="character-container">
      <h2>Create Your AI Character</h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="character-form"
      >
        <input
          type="text"
          name="name"
          placeholder="Character Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          name="description"
          placeholder="Character Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <textarea
          name="personality"
          placeholder="Character Personality"
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Create Character</button>
      </form>
    </div>
  );
};

export default Aicharacter;
