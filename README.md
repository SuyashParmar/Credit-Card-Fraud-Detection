# Credit Card Fraud Detection System

This repository contains a Machine Learning project for detecting fraudulent credit card transactions. It includes a Jupyter Notebook for data analysis and model training, and a Streamlit web application for identifying fraudulent transactions in real-time.

## Project Overview

The goal of this project is to build a classifier that can distinguish between legitimate and fraudulent credit card transactions. 
- **Dataset**: The model is trained on a dataset containing credit card transactions, including PCA-transformed features (V1-V28), Time, and Amount.
- **Model**: A machine learning model (likely Random Forest or Decision Tree) is trained to classify transactions.
- **Interface**: A user-friendly Streamlit interface allows users to input transaction details and get immediate feedback.

## Repository Structure

- `Credit card.ipynb`: Jupyter Notebook containing data preprocessing, exploratory data analysis (EDA), and model training steps.
- `app.py`: The main Python script for the Streamlit web application.
- `model.pkl`: The serialized pre-trained machine learning model.
- `requirements.txt`: List of Python dependencies required to run the project.
- `images.jpg`: Image asset used in the web application.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/SuyashParmar/Credit-Card-Fraud-Detection.git
    cd Credit-Card-Fraud-Detection
    ```

2.  **Install dependencies:**
    It is recommended to use a virtual environment.
    ```bash
    pip install -r requirements.txt
    ```

## Usage

1.  **Run the Streamlit App:**
    ```bash
    streamlit run app.py
    ```

2.  **Input Features:**
    The application expects input features corresponding to the processed data used for training.
    
    You need to provide **29 comma-separated values** in the text input field:
    - **V1 through V28**: The principal components obtained with PCA.
    - **Normalized Amount**: The transaction amount scaled using Standard Scaler.
    
    *Example Input format:*
    `-1.359807, -0.072781, ..., 0.244964`

3.  **Get Prediction:**
    Click the "Submit" button. The model will predict if the transaction is **Legitimate** or **Fraudulent**.

## Model Training

The `Credit card.ipynb` notebook demonstrates:
- Loading and exploring the dataset.
- Handling class imbalance (fraud cases are much fewer than legitimate ones).
- Feature scaling.
- Train-test split.
- Model Training and Evaluation using metrics like accuracy, precision, recall, and F1-score.

## Dependencies

- pandas
- numpy
- scikit-learn
- imbalanced-learn
- streamlit
- Pillow
- pickleshare

