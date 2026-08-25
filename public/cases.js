// Load Firebase config from Render meta tag
const meta = document.querySelector('meta[name="firebase-config"]');

let firebaseConfig;
try {
  firebaseConfig = JSON.parse(meta.content);
} catch (e) {
  console.error("Firebase config error:", e);
  document.getElementById("case-create-status").textContent =
    "Firebase config error. Check FIREBASE_CONFIG in Render.";
}

// Initialize Firebase
if (firebaseConfig) {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // Create Case Button
  document.getElementById("create-case-btn").onclick = async () => {
    const title = document.getElementById("case-title").value.trim();
    const user = document.getElementById("case-user").value.trim();
    const desc = document.getElementById("case-desc").value.trim();

    if (!title || !user || !desc) {
      document.getElementById("case-create-status").textContent =
        "All fields are required.";
      return;
    }

    const caseData = {
      title,
      user,
      description: desc,
      timestamp: Date.now()
    };

    try {
      await db.collection("cases").add(caseData);
      document.getElementById("case-create-status").textContent =
        "Case created successfully ✔";

      document.getElementById("case-title").value = "";
      document.getElementById("case-user").value = "";
      document.getElementById("case-desc").value = "";

      loadCases();
    } catch (err) {
      console.error(err);
      document.getElementById("case-create-status").textContent =
        "Error creating case.";
    }
  };

  // Load Cases
  async function loadCases() {
    const container = document.getElementById("case-list");
    container.textContent = "Loading...";

    try {
      const snapshot = await db.collection("cases")
        .orderBy("timestamp", "desc")
        .get();

      if (snapshot.empty) {
        container.textContent = "No cases found.";
        return;
      }

      const list = document.createElement("ul");

      snapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement("li");

        li.innerHTML = `
          <strong>${data.title}</strong><br>
          User: ${data.user}<br>
          Description: ${data.description}<br>
          <small>${new Date(data.timestamp).toLocaleString()}</small>
        `;

        list.appendChild(li);
      });

      container.innerHTML = "";
      container.appendChild(list);

    } catch (err) {
      console.error(err);
      container.textContent = "Error loading cases.";
    }
  }

  // Initial load
  loadCases();
}
