// =====================================================
// AI EMAIL SHIELD - script.js (Part 1)
// =====================================================

// ---------------- DOM Elements ----------------

const emailText = document.getElementById("emailText");
const counter = document.getElementById("count");

const loader = document.getElementById("loader");
const result = document.getElementById("result");

const confidence = document.getElementById("confidence");
const progressFill = document.getElementById("progressFill");

const risk = document.getElementById("risk");
const time = document.getElementById("time");

const aiReason = document.getElementById("aiReason");

const historyList = document.getElementById("historyList");

const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const fileInput = document.getElementById("fileInput");

const themeToggle = document.getElementById("themeToggle");
const assistantButton = document.getElementById("assistantButton");
const downloadReport = document.getElementById("downloadReport");

const cursorGlow = document.querySelector(".cursor-glow");


// =====================================================
// Theme
// =====================================================

function setTheme(mode){

    if(mode==="light"){

        document.body.classList.add("light");

        themeToggle.innerHTML='<i class="fa-solid fa-sun"></i>';

    }

    else{

        document.body.classList.remove("light");

        themeToggle.innerHTML='<i class="fa-solid fa-moon"></i>';

    }

    localStorage.setItem("theme",mode);

}

setTheme(localStorage.getItem("theme") || "dark");

themeToggle.addEventListener("click",()=>{

    setTheme(

        document.body.classList.contains("light")

        ? "dark"

        : "light"

    );

});


// =====================================================
// Cursor Glow
// =====================================================

document.addEventListener("mousemove",(e)=>{

    if(cursorGlow){

        cursorGlow.style.left=e.clientX+"px";

        cursorGlow.style.top=e.clientY+"px";

    }

});


// =====================================================
// Character Counter
// =====================================================

emailText.addEventListener("input",()=>{

    counter.textContent=emailText.value.length+" Characters";

});


// =====================================================
// File Upload
// =====================================================

fileInput.addEventListener("change",()=>{

    const file=fileInput.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=(e)=>{

        emailText.value=e.target.result;

        counter.textContent=emailText.value.length+" Characters";

        showToast("Email loaded.");

    };

    reader.readAsText(file);

});


// =====================================================
// Copy
// =====================================================

copyBtn.addEventListener("click",()=>{

    navigator.clipboard.writeText(emailText.value);

    showToast("Copied to clipboard.");

});


// =====================================================
// Clear
// =====================================================

clearBtn.addEventListener("click",()=>{

    emailText.value="";

    counter.textContent="0 Characters";

    result.innerHTML="Waiting...";

    result.style.color="";

    confidence.textContent="--";

    progressFill.style.width="0%";

    risk.textContent="Unknown";

    risk.style.background="#555";

    time.textContent="--";

    aiReason.textContent="Waiting for prediction...";

});


// =====================================================
// Ctrl + Enter
// =====================================================

emailText.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key==="Enter"){

        predictSpam();

    }

});


// =====================================================
// Toast
// =====================================================

function showToast(message){

    const toast=document.createElement("div");

    toast.className="toast";

    toast.textContent=message;

    document.body.appendChild(toast);

    setTimeout(()=>toast.classList.add("show"),100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>toast.remove(),300);

    },2500);

}


// =====================================================
// Typing Hero
// =====================================================

const typing=document.getElementById("typingText");

if(typing){

const words=[

"Using Artificial Intelligence",

"Powered by Machine Learning",

"Detect Spam in Seconds",

"Built with Python & Flask"

];

let word=0;

let letter=0;

let deleting=false;

function heroTyping(){

const current=words[word];

if(!deleting){

typing.textContent=current.substring(0,letter++);

if(letter>current.length){

deleting=true;

setTimeout(heroTyping,1500);

return;

}

}

else{

typing.textContent=current.substring(0,letter--);

if(letter===0){

deleting=false;

word=(word+1)%words.length;

}

}

setTimeout(heroTyping,deleting?40:80);

}

heroTyping();

}

// =====================================================
// AI EMAIL SHIELD - script.js (Part 2)
// =====================================================

// ---------------- Predict Spam ----------------

async function predictSpam() {

    const text = emailText.value.trim();

    if (!text) {
        showToast("Please enter an email.");
        return;
    }

    loader.style.display = "block";

    result.innerHTML = "Analyzing...";
    result.style.color = "";

    confidence.textContent = "--";

    progressFill.style.width = "0%";

    risk.textContent = "Analyzing";
    risk.style.background = "#666";

    aiReason.textContent = "AI is analyzing your email...";

    const start = performance.now();

    try {

        const response = await fetch("/predict", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                email: text

            })

        });

        const data = await response.json();

        loader.style.display = "none";

        const end = performance.now();

        time.textContent = Math.round(end - start) + " ms";

        const label = data.prediction;

        const conf = Number(data.confidence);

        // Animate Progress Bar

        progressFill.style.width = "0%";

        setTimeout(() => {

            progressFill.style.width = conf + "%";

        }, 150);

        confidence.textContent = conf.toFixed(2) + "%";

        if (label === "Spam") {

            result.innerHTML = "🚨 SPAM EMAIL";

            result.style.color = "#ff4b5c";

            risk.textContent = "High";

            risk.style.background = "#ff4b5c";

            aiReason.textContent =
                "The model detected promotional, suspicious or phishing-like patterns commonly found in spam emails.";

        }

        else {

            result.innerHTML = "✅ SAFE EMAIL";

            result.style.color = "#18d26e";

            risk.textContent = "Low";

            risk.style.background = "#18d26e";

            aiReason.textContent =
                "The email appears legitimate and does not contain typical spam indicators.";

        }

        saveHistory(text, label, conf);

        showToast("Prediction Completed");

    }

    catch (error) {

        loader.style.display = "none";

        result.innerHTML = "Server Error";

        result.style.color = "#ff4b5c";

        confidence.textContent = "--";

        progressFill.style.width = "0%";

        risk.textContent = "Unknown";

        risk.style.background = "#666";

        aiReason.textContent = "Unable to contact Flask server.";

        console.error(error);

        showToast("Server Connection Failed");

    }

}

// ---------------- Prediction History ----------------

function saveHistory(email, prediction, confidenceValue) {

    let history = JSON.parse(localStorage.getItem("spamHistory")) || [];

    history.unshift({

        email: email.substring(0, 90),

        prediction,

        confidence: confidenceValue,

        date: new Date().toLocaleString()

    });

    if (history.length > 6) {

        history.pop();

    }

    localStorage.setItem("spamHistory", JSON.stringify(history));

    loadHistory();

}

// ---------------- Load History ----------------

function loadHistory() {

    const history = JSON.parse(localStorage.getItem("spamHistory")) || [];

    historyList.innerHTML = "";

    if (history.length === 0) {

        historyList.innerHTML = `

        <div class="history-card">

            No predictions yet.

        </div>

        `;

        return;

    }

    history.forEach(item => {

        historyList.innerHTML += `

        <div class="history-card">

            <h3 style="margin-bottom:10px;color:${item.prediction === "Spam" ? "#ff4b5c" : "#18d26e"}">

                ${item.prediction === "Spam" ? "🚨 Spam" : "✅ Safe"}

            </h3>

            <p style="margin-bottom:15px">

                ${item.email}...

            </p>

            <small>

                Confidence:

                ${item.confidence.toFixed(1)}%

            </small>

            <br>

            <small>

                ${item.date}

            </small>

        </div>

        `;

    });

}

// ---------------- Assistant ----------------

assistantButton.addEventListener("click", () => {

    showToast("🤖 AI Assistant: Paste an email and click Analyze.");

});

// ---------------- Download Report ----------------

downloadReport.addEventListener("click", () => {

    const report = `

==============================

AI EMAIL SHIELD REPORT

==============================

Prediction : ${result.innerText}

Confidence : ${confidence.innerText}

Risk Level : ${risk.innerText}

Processing Time : ${time.innerText}

Generated :

${new Date().toLocaleString()}

==============================

`;

    const blob = new Blob(

        [report],

        {

            type: "text/plain"

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Spam_Report.txt";

    a.click();

    URL.revokeObjectURL(url);

    showToast("Report Downloaded");

});

// ---------------- Initialize ----------------

loadHistory();

showToast("🤖 AI Email Shield Ready");