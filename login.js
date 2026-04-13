<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAEzToZ33xqgsKM2H8Ud-_ti_B5xJWmliM",
  authDomain: "doisgacor.firebaseapp.com",
  projectId: "doisgacor",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.login = async function () {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Isi semua field!");
    return;
  }

  const snapshot = await getDocs(collection(db, "users"));

  let found = false;

  snapshot.forEach((doc) => {
    const data = doc.data();

    if (data.username === username && data.password === password) {
      found = true;

      // CEK EXPIRED
      if (data.expired) {
        const now = new Date();
        const exp = new Date(data.expired);

        if (exp < now) {
          alert("Akun expired!");
          return;
        }
      }

      // SIMPAN LOGIN + ROLE
      localStorage.setItem("loginUser", JSON.stringify(data));

      alert("Login berhasil sebagai " + data.role);

      // REDIRECT SESUAI ROLE
      if (data.role === "admin") {
        window.location.href = "admin.html";
      } else if (data.role === "reseller") {
        window.location.href = "reseller.html";
      } else {
        window.location.href = "index.html";
      }
    }
  });

  if (!found) {
    alert("Username / password salah");
  }
};
</script>