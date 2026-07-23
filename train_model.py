import pandas as pd
import string
import re
import joblib
import nltk

from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

# Download NLTK data (only needed the first time)
nltk.download("stopwords")

# -----------------------------
# Load Dataset
# -----------------------------
df = pd.read_csv("dataset/emails.csv")

print("\nFirst 5 Rows\n")
print(df.head())

print("\nDataset Shape:")
print(df.shape)

print("\nMissing Values:")
print(df.isnull().sum())

# Remove missing rows
df.dropna(inplace=True)

# -----------------------------
# Text Cleaning
# -----------------------------
stemmer = PorterStemmer()
stop_words = set(stopwords.words("english"))


def clean_text(text):

    text = text.lower()

    # Remove URLs
    text = re.sub(r"http\S+|www\S+", "", text)

    # Remove Email Addresses
    text = re.sub(r"\S+@\S+", "", text)

    # Remove Numbers
    text = re.sub(r"\d+", "", text)

    # Remove punctuation
    text = text.translate(str.maketrans("", "", string.punctuation))

    words = text.split()

    cleaned_words = []

    for word in words:

        if word not in stop_words:

            cleaned_words.append(stemmer.stem(word))

    return " ".join(cleaned_words)


print("\nCleaning Email Text...\n")

df["text"] = df["text"].apply(clean_text)

# -----------------------------
# Features
# -----------------------------
vectorizer = TfidfVectorizer(
    max_features=10000
)

X = vectorizer.fit_transform(df["text"])

y = df["spam"]

# -----------------------------
# Train/Test Split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# -----------------------------
# Train Model
# -----------------------------
print("\nTraining Model...\n")

model = LogisticRegression(max_iter=2000)

model.fit(X_train, y_train)

# -----------------------------
# Evaluation
# -----------------------------
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("\nAccuracy")

print(f"{accuracy*100:.2f}%")

print("\nClassification Report\n")

print(classification_report(y_test, predictions))

print("\nConfusion Matrix\n")

print(confusion_matrix(y_test, predictions))

# -----------------------------
# Save Model
# -----------------------------
joblib.dump(model, "model/model.pkl")
joblib.dump(vectorizer, "model/vectorizer.pkl")

print("\nModel Saved Successfully!")