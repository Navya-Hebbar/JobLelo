import os
import pickle
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer # Included for context, though simple matching is used below

# --- Configuration and File Names ---
TRAINING_DATA_FILE = "training_data.csv"
MODEL_FILE = "resume_category_classifier_model.pkl"

# --- Initialization ---
app = Flask(__name__)
# Enable CORS for frontend communication
CORS(app) 

# Global variables to hold model and data
CLASSIFIER_MODEL = None
JOB_DATA = None

# --- File Loading Helper ---
def load_file_path(file_name):
    """
    Safely retrieves the file path string, handling the common error 
    where the path might be returned as a single-element list.
    """
    # In some execution environments, file IDs might be returned as a list
    if isinstance(file_name, list):
        # We explicitly take the first element (the file path string)
        return file_name[0]
    return file_name

# --- Data and Model Loading ---
def load_resources():
    global CLASSIFIER_MODEL, JOB_DATA
    
    # 1. Load the Classifier Model
    try:
        model_path = load_file_path(MODEL_FILE)
        print(f"Loading model from: {model_path}")
        with open(model_path, 'rb') as f:
            CLASSIFIER_MODEL = pickle.load(f)
        print("Classifier model loaded successfully.")
    except Exception as e:
        print(f"ERROR: Failed to load CLASSIFIER_MODEL from {MODEL_FILE}. Ensure file exists and path is correct. Error: {e}")
        CLASSIFIER_MODEL = None

    # 2. Load the Job Data
    try:
        data_path = load_file_path(TRAINING_DATA_FILE)
        print(f"Loading job data from: {data_path}")
        JOB_DATA = pd.read_csv(data_path)
        # Standardize and clean data for robust matching
        JOB_DATA['job_description'] = JOB_DATA['job_description'].astype(str).str.lower()
        JOB_DATA = JOB_DATA.rename(columns={'position_title': 'role', 'company_name': 'company'})
        print("Job data loaded successfully.")
    except Exception as e:
        print(f"ERROR: Failed to load JOB_DATA from {TRAINING_DATA_FILE}. Error: {e}")
        JOB_DATA = pd.DataFrame()

# Load resources when the app starts
load_resources()


# --- Job Matching and Prediction Logic ---

def clean_and_tokenize_text(text):
    """Removes punctuation and tokenizes text for comparison."""
    if pd.isna(text):
        return set()
    # Normalize text to lower case, remove punctuation, split into words
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower())
    return set(text.split())


def calculate_match_score(user_skills, job_description):
    """Calculates a simple score based on common keywords."""
    if not job_description:
        return 0, []

    # Prepare user skills
    # user_skills is expected to be a list of cleaned strings from the frontend
    user_skill_set = set(skill.lower() for skill in user_skills)
    
    # Prepare job skills (from description)
    job_description_set = clean_and_tokenize_text(job_description)
    
    # Find overlapping skills
    matched_skills = user_skill_set.intersection(job_description_set)
    
    # The job description contains many filler words, so we can't use a simple 
    # percentage of job words covered. We use a formula based on user's skills.
    
    total_user_skills = len(user_skill_set)
    matched_skill_count = len(matched_skills)
    
    if total_user_skills == 0:
        return 0, []
    
    # Simple score based on percentage of user skills found in the job description
    match_score = (matched_skill_count / total_user_skills) * 100
    
    # The "missing skills" are skills in the job description that might be relevant
    # but for a simplified model, we'll just track unmatched user skills if the 
    # match is poor, or just return empty for 'missing skills'
    
    # Let's define "missing skills" as user skills that were not found in the job description
    missing_skills_list = list(user_skill_set - matched_skills)

    # We will truncate match score to a maximum of 95 for realism
    return min(95, round(match_score)), missing_skills_list


# --- Flask Route ---
@app.route('/api/job-matches', methods=['POST'])
def get_job_matches():
    if CLASSIFIER_MODEL is None or JOB_DATA.empty:
        return jsonify({"success": False, "message": "Backend resources (Model/Data) not loaded."}), 500

    data = request.get_json()
    user_skills_list = data.get('skills', [])
    user_skills_raw = ", ".join(user_skills_list)
    # experience = data.get('experience') # Not used in current simple matching logic
    # preferences = data.get('preferences', {}) # Not used in current simple matching logic

    if not user_skills_raw:
        return jsonify({"success": False, "message": "Skills are required."}), 400

    try:
        # 1. AI PREDICTION STEP: Use the loaded classifier model
        # The model expects a list of strings (here, a list with one skills string)
        predicted_category = CLASSIFIER_MODEL.predict([user_skills_raw])[0]
        
        # 2. FILTER JOBS: Filter the entire dataset by the predicted category
        filtered_jobs = JOB_DATA[
            JOB_DATA['Category'].astype(str).str.lower() == predicted_category.lower()
        ].copy() # Use .copy() to avoid SettingWithCopyWarning
        
        if filtered_jobs.empty:
            return jsonify({
                "success": True, 
                "matches": [], 
                "predictedCategory": predicted_category
            })

        matches = []
        for _, job in filtered_jobs.iterrows():
            # 3. CALCULATE MATCH SCORE
            score, missing_skills = calculate_match_score(user_skills_list, job['job_description'])
            
            # Format salary and description (optional, as the job data is raw)
            salary_str = f"Competitive (Based on {job['Category']} standards)"
            
            matches.append({
                "role": job['role'],
                "company": job['company'],
                "salary": salary_str,
                "description": job['job_description'][:200] + "...", # Truncate description for display
                "matchScore": score,
                "missingSkills": missing_skills
            })

        # 4. SORT AND RETURN
        # Sort by matchScore in descending order
        sorted_matches = sorted(matches, key=lambda x: x['matchScore'], reverse=True)
        
        return jsonify({
            "success": True,
            "matches": sorted_matches,
            "predictedCategory": predicted_category # <-- Output used by frontend
        })

    except Exception as e:
        print(f"An error occurred during job matching: {e}")
        return jsonify({"success": False, "message": f"An internal server error occurred: {e}"}), 500

if __name__ == '__main__':
    # Flask runs on port 5000 by default
    app.run(debug=True)