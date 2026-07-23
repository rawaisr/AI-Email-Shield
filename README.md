# 🚨 AI Email Shield

An advanced Machine Learning and Natural Language Processing (NLP) web application designed to classify emails as **Spam** or **Safe**. This project was developed for educational and internship purposes to demonstrate the practical deployment of predictive models into interactive, modern user interfaces.

---

## 🚀 Key Features

*   **Real-time AI Analysis:** Classify text inputs instantly with a calculated confidence percentage.
*   **Comprehensive Text Preprocessing:** Custom NLP pipeline including tokenization, stopword filtering, punctuation/URL/digit removal, and Porter Stemming.
*   **Dual-Theme Dynamic UI:** Premium, responsive dashboard with automatic light/dark mode switching, animated typing hero, and cursor-glow background tracking.
*   **Prediction History:** View up to 6 recent scans locally preserved via browser `localStorage`.
*   **Analytical Reports:** Generate and download standard `.txt` summary reports directly from the interface.
*   **Local File Parsing:** Upload raw `.txt` files directly into the analyzer.

---

## 🛠️ Tech Stack & Architecture

### Backend (Machine Learning & Core API)
*   **Python 3.x**
*   **Flask (v3.1.0):** Lightweight web framework serving prediction endpoints.
*   **Scikit-Learn (v1.7.0):** Powers the core Machine Learning classification pipeline.
*   **NLTK (v3.9.1):** Utilized for tokenization and localized stopword handling.
*   **Joblib:** Manages serializing and loading the trained model artifacts.

### Frontend (User Interface)
*   **Semantic HTML5 & Modern CSS3:** Fully responsive layout with custom variable mapping, flexbox/grid structures, and keyframe animations.
*   **Vanilla JavaScript (ES6+):** Async fetch requests, persistent LocalStorage data stores, and real-time DOM manipulation.

---

## 📊 Model Architecture & Performance

The model utilizes **TF-IDF Vectorization** with a vocabulary constraint of 10,000 maximum features. Classification is determined by a highly tuned **Logistic Regression** binary classifier.

### Evaluation Metrics
| Metric | Score | Description |
| :--- | :--- | :--- |
| **Accuracy** | **97.82%** | Overall correct classifications across testing split |
| **Precision** | **98.00%** | Accuracy of positive spam predictions |
| **Recall** | **92.00%** | Detection rate of actual spam emails |
| **F1-Score** | **95.00%** | Balanced harmonic mean of Precision & Recall |

### Confusion Matrix Breakdown
*   **True Negative (Actual Safe predicted Safe):** 868
*   **False Positive (Actual Safe predicted Spam):** 4
*   **False Negative (Actual Spam predicted Safe):** 21
*   **True Positive (Actual Spam predicted Spam):** 253

---

## 📂 Repository Structure

```text
AI-Email-Shield/
├── dataset/
│   └── emails.csv          # Base training dataset
├── model/
│   ├── model.pkl           # Saved Logistic Regression model
│   └── vectorizer.pkl      # Saved TF-IDF Vectorizer
├── static/
│   ├── css/
│   │   └── style.css       # Main stylesheet (Dark & Light variables)
│   └── js/
│       └── script.js       # App controls, async API handling, history
├── templates/
│   └── index.html          # Dashboard user interface
├── .gitignore              # Dependency/Venv tracking ignores
├── app.py                  # Core Flask production application server
├── train_model.py          # Model training, assessment, and export script
└── requirements.txt        # Frozen project dependencies
```

---

## ⚙️ Installation & Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/rawaisr/AI-Email-Shield.git
cd AI-Email-Shield
```

### 2. Environment Setup
Create a secure virtual environment and activate it:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Train the Model (Optional)
If you wish to rebuild or verify the model weights from the raw dataset:
```bash
python train_model.py
```

### 5. Run the Application
Execute the local server script:
```bash
python app.py
```
Open your preferred web browser and navigate to `http://127.0.0.1:5000/`.

---

## 📝 Educational and Internship Notice
> This project was developed for educational and internship purposes. It emphasizes the complete pipeline of building an applied data science solution: starting from raw unstructured text data cleaning, moving to data aggregation, running model training evaluations, constructing back-end validation servers, and wrapping the solution into a high-fidelity interface.
