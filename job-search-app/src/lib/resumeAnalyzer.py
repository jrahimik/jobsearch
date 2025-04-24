#!/usr/bin/env python3
import PyPDF2
import re
import os
import sys
import json

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file."""
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                text += reader.pages[page_num].extract_text()
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_keywords(text):
    """Extract relevant keywords from resume text."""
    # Define categories of keywords to look for
    keyword_patterns = {
        'programming_languages': [
            'Python', 'Java', 'C\\+\\+', 'JavaScript', 'TypeScript', 'R', 
            'MATLAB', 'SQL', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Go', 'Rust'
        ],
        'machine_learning': [
            'Machine Learning', 'Deep Learning', 'Neural Networks', 'NLP', 
            'Natural Language Processing', 'Computer Vision', 'AI', 
            'Artificial Intelligence', 'Data Mining', 'Predictive Modeling',
            'Reinforcement Learning', 'Supervised Learning', 'Unsupervised Learning',
            'Classification', 'Regression', 'Clustering', 'Dimensionality Reduction'
        ],
        'ml_frameworks': [
            'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'Pandas', 'NumPy',
            'SciPy', 'NLTK', 'spaCy', 'OpenCV', 'Caffe', 'Theano', 'MXNet',
            'Hugging Face', 'Transformers'
        ],
        'data_science': [
            'Data Science', 'Data Analysis', 'Data Visualization', 'Big Data',
            'Data Mining', 'Statistics', 'A/B Testing', 'Hypothesis Testing',
            'Exploratory Data Analysis', 'EDA', 'Feature Engineering',
            'Feature Selection', 'Data Preprocessing', 'Data Cleaning'
        ],
        'cloud_platforms': [
            'AWS', 'Amazon Web Services', 'Google Cloud', 'GCP', 'Azure',
            'IBM Cloud', 'Oracle Cloud', 'Heroku', 'DigitalOcean'
        ],
        'web_development': [
            'HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue', 'Node.js',
            'Express', 'Django', 'Flask', 'Ruby on Rails', 'Spring', 'ASP.NET',
            'Frontend', 'Backend', 'Full Stack', 'RESTful API', 'GraphQL'
        ],
        'databases': [
            'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'NoSQL', 'Oracle',
            'SQLite', 'Redis', 'Cassandra', 'DynamoDB', 'Firebase'
        ],
        'devops': [
            'DevOps', 'CI/CD', 'Docker', 'Kubernetes', 'Jenkins', 'Git',
            'GitHub', 'GitLab', 'Bitbucket', 'Terraform', 'Ansible', 'Puppet',
            'Chef', 'Continuous Integration', 'Continuous Deployment'
        ],
        'soft_skills': [
            'Leadership', 'Team Management', 'Project Management', 'Agile',
            'Scrum', 'Communication', 'Problem Solving', 'Critical Thinking',
            'Collaboration', 'Time Management', 'Adaptability'
        ]
    }
    
    # Extract keywords from text
    found_keywords = []
    
    for category, keywords in keyword_patterns.items():
        for keyword in keywords:
            # Create a regex pattern that matches the keyword as a whole word
            pattern = r'\b' + keyword + r'\b'
            if re.search(pattern, text, re.IGNORECASE):
                # Add the keyword with proper capitalization
                found_keywords.append(keyword)
    
    # Remove duplicates while preserving order
    unique_keywords = []
    for keyword in found_keywords:
        if keyword not in unique_keywords:
            unique_keywords.append(keyword)
    
    return unique_keywords

def analyze_resume(pdf_path):
    """Analyze a resume PDF and extract relevant information."""
    text = extract_text_from_pdf(pdf_path)
    if not text:
        return {
            "success": False,
            "error": "Failed to extract text from PDF",
            "keywords": []
        }
    
    keywords = extract_keywords(text)
    
    return {
        "success": True,
        "keywords": keywords,
        "text_sample": text[:500] + "..." if len(text) > 500 else text
    }

# Main execution
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python resumeAnalyzer.py <pdf_path>")
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        sys.exit(1)
        
    result = analyze_resume(pdf_path)
    print(f"Analysis Result:")
    print(f"Success: {result['success']}")
    print(f"Keywords: {result['keywords']}")
    print(f"Text Sample: {result['text_sample']}")
