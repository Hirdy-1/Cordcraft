// Read Firebase config from meta tag
const meta = document.querySelector('meta[name="firebase-config"]');

let firebaseConfig;
try {
  firebaseConfig = JSON.parse(meta.content);
} catch (e) {
  console.error("Firebase config error:", e);
  document.getElementById("admin-status").textContent =
    "Firebase config error. Check FIREBASE_CONFIG in Render.";
}

// Initialize Firebase
if (firebaseConfig) {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  document.getElementById("admin-status").textContent =
    "Firebase connected ✔ Admin dashboard ready.";

  // Load users
  db.collection("users")
    .get()
    .then((snapshot) => {
      const container = document.getElementById("users-list");
      if (snapshot.empty) {
        container.textContent = "No users found.";
        return;
      }

      const list = document.createElement("ul");
      snapshot.forEach((doc) => {
        const li = document.createElement("li");
        li.textContent = `${doc.id}: ${JSON.stringify(doc.data())}`;
        list.appendChild(li);
      });
      container.innerHTML = "";
      container.appendChild(list);
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("users-list").textContent =
        "Error loading users.";
    });

  // Load logs
  db.collection("logs")
    .orderBy("timestamp", "desc")
    .limit(20)
    .get()
    .then((snapshot) => {
      const container = document.getElementById("logs-list");
      if (snapshot.empty) {
        container.textContent = "No logs found.";
        return;
      }

      const list = document.createElement("ul");
      snapshot.forEach((doc) => {
        const li = document.createElement("li");
        li.textContent = `${doc.id}: ${JSON.stringify(doc.data())}`;
        list.appendChild(li);
      });
      container.innerHTML = "";
      container.appendChild(list);
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("logs-list").textContent =
        "Error loading logs.";
    });
}
