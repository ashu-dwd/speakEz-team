import React, { useState } from 'react';
import './Aicharacter';

const Aicharacter = () => {
  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [personality,setPersonality] = useState("");
  const [image,setImage] = useState(null);

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (!name || !description || !personality || !image ) {
      alert("Fill all the field")
    return;
  }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("personality", personality);
    formData.append("image", image);
      
    try {
      const res = await axios.post("http://localhost:5000/api/aiChar",formData); 
      alert ("Character created Successfully");
    } catch (error) {
     console.log(error)
     alert("Something went wrong");
    }

  }
   if (!isAdmin) {
    return <h2> Access Denied</h2>;
  }

  return (
    <div>
      {isAdmin ? (
        <>
          <h2>Create Your AI Character</h2>
          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
              type="text"
              name="name"
              placeholder="Character Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
            <textarea
              name="personality"
              placeholder="Personality"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              required
            ></textarea>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
            <button type="submit">Create Character</button>
          </form>
        </>
      ) : (
        <p>Access Denied</p>
      )}
    </div>
  );
};
  

export default Aicharacter


