from flask import Flask, render_template, request, jsonify
import joblib
import re
import string
import nltk

from nltk.corpus import stopwords

# Download stopwords if not already downloaded
nltk.download("stopwords")

stop_words = set(stopwords.words("english"))

app = Flask(__name__)

# ==============================
# Load Trained Model
# ==============================

model = joblib.load("model/model.pkl")
vectorizer = joblib.load("model/vectorizer.pkl")


# ==============================
# Clean Email
# ==============================

def clean_text(text):

    text = str(text)

    text = text.lower()

    text = re.sub(r"http\\S+", " ", text)

    text = re.sub(r"www\\S+", " ", text)

    text = re.sub(r"\\S+@\\S+", " ", text)

    text = text.translate(
        str.maketrans("", "", string.punctuation)
    )

    words = text.split()

    words = [
        word
        for word in words
        if word not in stop_words
    ]

    return " ".join(words)


# ==============================
# Home
# ==============================

@app.route("/")
def home():

    return render_template("index.html")


# ==============================
# Prediction
# ==============================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        email = data.get("email", "")

        cleaned = clean_text(email)

        vector = vectorizer.transform([cleaned])

        prediction = model.predict(vector)[0]

        probability = model.predict_proba(vector)[0]

        confidence = round(max(probability) * 100, 2)

        result = "Spam" if prediction == 1 else "Safe"

        return jsonify({

            "prediction": result,

            "confidence": confidence

        })

    except Exception as e:

        return jsonify({

            "prediction": "Error",

            "confidence": 0,

            "message": str(e)

        }), 500


# ==============================
# Run
# ==============================

if __name__ == "__main__":

    app.run(debug=True)