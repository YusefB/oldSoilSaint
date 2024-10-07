import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const refinedPrompt = `
      Convert the following casual farm description to an SQL query:
      User Input: "${query}"
      Interpret values such as "hot," "cold," "humid," "dry," "tropical," "desert," and "Florida" into temperature ranges, climate types, and regions.
      Provide only the crops that match the user's conditions (e.g., climate, temperature, region, soil type). If any value is missing in the database, skip it.
    `;

    const response = await fetch("http://127.0.0.1:5000/natural_query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: refinedPrompt }),
    });

    const data = await response.json();

    setResult(data.message || "No result found.");
  };

  return (
    <div>
      <h1>Farm Crop Recommender</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your farm: e.g., 'My farm is hot' or 'I live in Florida'"
        />
        <button type="submit">Submit</button>
      </form>
      <h2>Results:</h2>
      <div>{result}</div>
    </div>
  );
}

export default App;
