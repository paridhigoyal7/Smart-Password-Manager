// Demo master passkey 
const masterPasskey = "1234"; 

// Load saved credentials from localStorage
let credentials = JSON.parse(localStorage.getItem("credentials")) || {};

const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");
const credentialList = document.getElementById("credentialList");
const accountModal = document.getElementById("accountModal");
const accountsDiv = document.getElementById("accounts");

// Save new credential
function saveCredential() {
  const site = document.getElementById("siteInput").value.trim();
  const user = document.getElementById("userInput").value.trim();
  const pass = document.getElementById("passInput").value.trim();

  if (!site || !user || !pass) {
    alert("Please fill all fields!");
    return;
  }

  if (!credentials[site]) credentials[site] = [];
  credentials[site].push({ username: user, password: pass });

  localStorage.setItem("credentials", JSON.stringify(credentials));

  document.getElementById("siteInput").value = "";
  document.getElementById("userInput").value = "";
  document.getElementById("passInput").value = "";

  renderSites();
}

// Render site list
function renderSites() {
  credentialList.innerHTML = "";
  Object.keys(credentials).forEach(site => {
    const card = document.createElement("div");
    card.className = "credential-card";
    card.innerHTML = `<h3>${site}</h3>
      <button onclick="openModal('${site}')">View Accounts</button>`;
    credentialList.appendChild(card);
  });
}

// Autocomplete search
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  suggestions.innerHTML = "";
  if (query) {
    const matches = Object.keys(credentials).filter(site =>
      site.toLowerCase().includes(query)
    );
    matches.forEach(site => {
      const li = document.createElement("li");
      li.textContent = site;
      li.onclick = () => selectSite(site);
      suggestions.appendChild(li);
    });
  }
});

function selectSite(site) {
  searchInput.value = site;
  suggestions.innerHTML = "";
  openModal(site);
}

// Modal functions
function openModal(site) {
  accountsDiv.innerHTML = "";
  credentials[site].forEach((acc, index) => {
    const div = document.createElement("div");
    div.className = "account";
    div.innerHTML = `
      <p>${acc.username}</p>
      <button onclick="revealPassword('${acc.password}')">Reveal</button>
      <button onclick="navigator.clipboard.writeText('${acc.password}')">Copy</button>
      <button onclick="deleteCredential('${site}', ${index})" style="color:red;">Delete</button>
    `;
    accountsDiv.appendChild(div);
  });
  accountModal.classList.remove("hidden");
}

function closeModal() {
  accountModal.classList.add("hidden");
}

// Passkey check before revealing password
function revealPassword(password) {
  const input = prompt("Enter passkey to reveal password:");
  if (input === masterPasskey) {
    alert("Password: " + password);
  } else {
    alert("Incorrect passkey. Access denied.");
  }
}

// Delete credential
function deleteCredential(site, index) {
  credentials[site].splice(index, 1);
  if (credentials[site].length === 0) {
    delete credentials[site];
  }
  localStorage.setItem("credentials", JSON.stringify(credentials));
  closeModal();
  renderSites();
}

// Initial render
renderSites();