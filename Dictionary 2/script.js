async function searchWord() {
  const word = document.getElementById("wordInput").value.trim();
  const defs = document.getElementById("definitions");
  const errorBox = document.getElementById("errorMsg");

  defs.innerHTML = "";
  errorBox.textContent = "";

  if (!word) {
    errorBox.textContent = "Please enter a word.";
    return;
  }

  // Early offline check
  if (!navigator.onLine) {
    errorBox.textContent = "No network connection. Check your internet.";
    return;
  }

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error("Word not found. Try another!");
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    const entry = data[0];
    const meanings = entry.meanings;

    let output = `<h2>${entry.word}</h2>`;

    let count = 0;
    meanings.forEach(m => {
      if (count >= 2) return; // limit to two meanings total

      output += `<h4>${m.partOfSpeech}</h4>`;
      m.definitions.forEach(d => {
        if (count >= 2) return;
        output += `<p>${d.definition}</p>`;

        if (d.example) {
          output += `<em>Example: ${d.example}</em><br>`;
        }

        if (d.synonyms && d.synonyms.length) {
          output += `<strong>Synonyms:</strong> ${d.synonyms.join(", ")}<br>`;
        }
        if (d.antonyms && d.antonyms.length) {
          output += `<strong>Antonyms:</strong> ${d.antonyms.join(", ")}<br>`;
        }

        count++;
      });
    });

    if (count === 0) {
      errorBox.textContent = "No definitions found.";
    } else {
      defs.innerHTML = output;
    }

  } catch (err) {
    errorBox.textContent = err.message.includes("Failed to fetch")
      ? "No network connection."
      : err.message;
  }
}


// document.getElementById('wordInput').addEventListener("keydown", function (e) {
//     if(e.key === "Enter")
//         e.preventDefault();
//     searchWord();
     
// })
