import { NextRequest, NextResponse } from 'next/server';

// Function to generate job search URLs based on job title and keywords
function generateRealJobUrls(jobTitle: string, keywords: string[]) {
  // Clean up the job title and create a search query
  const searchQuery = encodeURIComponent(jobTitle);
  const keywordsQuery = encodeURIComponent(keywords.slice(0, 3).join(' '));
  
  return {
    indeed: `https://www.indeed.com/jobs?q=${searchQuery}+${keywordsQuery}`,
    linkedin: `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}%20${keywordsQuery}`,
    glassdoor: `https://www.glassdoor.com/Job/${searchQuery.replace(/\s+/g, '-')}-jobs-SRCH_KO0,${searchQuery.length}.htm`,
    monster: `https://www.monster.com/jobs/search?q=${searchQuery}&where=remote`
  };
}

// Mock function to generate job matches based on keywords
function generateJobMatches(keywords: string[]) {
  // Define job categories and their associated keywords
  const jobCategories = {
    'data_science': [
      'Data Science', 'Python', 'R', 'Statistics', 'Machine Learning',
      'Data Analysis', 'Pandas', 'NumPy', 'SQL', 'Data Visualization'
    ],
    'machine_learning': [
      'Machine Learning', 'Deep Learning', 'Neural Networks', 'PyTorch',
      'TensorFlow', 'AI', 'Regression', 'Classification', 'Clustering',
      'Dimensionality Reduction'
    ],
    'research': [
      'Research', 'PhD', 'Academic', 'Publications', 'Statistics',
      'Analysis', 'MATLAB', 'R', 'Python'
    ],
    'healthcare': [
      'Healthcare', 'Biomedical', 'Medical', 'Clinical', 'Health',
      'Patient', 'Hospital', 'Pharmaceutical'
    ]
  };
  
  // Calculate match scores for each category
  const categoryScores: Record<string, {score: number, matching_keywords: string[]}> = {};
  for (const [category, categoryKeywords] of Object.entries(jobCategories)) {
    const matches = keywords.filter(kw => categoryKeywords.includes(kw));
    const score = Math.min(Math.round((matches.length / categoryKeywords.length) * 100), 100);
    categoryScores[category] = {
      score,
      matching_keywords: matches
    };
  }
  
  // Define job templates for each category
  const jobTemplates: Record<string, any[]> = {
    'data_science': [
      {
        'title': 'Data Scientist',
        'company': 'HealthTech Analytics',
        'location': 'Pittsburgh, PA (Hybrid)',
        'salary': '$120,000 - $150,000',
        'description': 'Looking for a Data Scientist to develop predictive models and analyze healthcare data to improve patient outcomes.',
        'requirements': 'Experience with Python, SQL, and statistical modeling. Background in healthcare data analysis preferred.',
      },
      {
        'title': 'Senior Data Analyst',
        'company': 'BioData Research',
        'location': 'Remote',
        'salary': '$110,000 - $135,000',
        'description': 'Join our team to analyze complex biomedical datasets and develop insights for healthcare providers.',
        'requirements': 'Strong background in statistical analysis, proficiency in Python, R, and SQL. Experience with healthcare data preferred.',
      }
    ],
    'machine_learning': [
      {
        'title': 'Machine Learning Engineer',
        'company': 'AI Health Solutions',
        'location': 'Boston, MA (On-site)',
        'salary': '$130,000 - $160,000',
        'description': 'Develop machine learning models to predict patient outcomes and improve healthcare delivery.',
        'requirements': 'Experience with PyTorch or TensorFlow, strong Python skills, and background in healthcare or biomedical data.',
      },
      {
        'title': 'AI Research Scientist',
        'company': 'MedTech Innovations',
        'location': 'San Francisco, CA (Remote)',
        'salary': '$140,000 - $170,000',
        'description': 'Research and develop cutting-edge AI solutions for medical diagnostics and treatment planning.',
        'requirements': 'PhD in Computer Science, Machine Learning, or related field. Experience with deep learning frameworks and medical data analysis.',
      }
    ],
    'research': [
      {
        'title': 'Research Scientist',
        'company': 'Biomedical Research Institute',
        'location': 'Philadelphia, PA (On-site)',
        'salary': '$115,000 - $145,000',
        'description': 'Conduct research on applying machine learning and statistical methods to biomedical data.',
        'requirements': 'PhD in Biostatistics, Data Science, or related field. Experience with statistical analysis and programming in R or Python.',
      },
      {
        'title': 'Computational Biologist',
        'company': 'Genomic Analytics',
        'location': 'Pittsburgh, PA (Hybrid)',
        'salary': '$125,000 - $155,000',
        'description': 'Apply computational methods to analyze genomic data and develop predictive models for disease risk.',
        'requirements': 'Strong background in statistics, machine learning, and programming. Experience with genomic data analysis preferred.',
      }
    ],
    'healthcare': [
      {
        'title': 'Healthcare Data Scientist',
        'company': 'Medical Systems Inc.',
        'location': 'Chicago, IL (Hybrid)',
        'salary': '$125,000 - $150,000',
        'description': 'Analyze healthcare data to improve patient outcomes and optimize hospital operations.',
        'requirements': 'Experience with healthcare data analysis, statistical modeling, and programming in Python or R.',
      },
      {
        'title': 'Clinical Data Analyst',
        'company': 'PharmaResearch',
        'location': 'Remote',
        'salary': '$105,000 - $130,000',
        'description': 'Analyze clinical trial data and develop statistical models to support drug development.',
        'requirements': 'Background in biostatistics or clinical data analysis. Proficiency in R, SAS, or Python.',
      }
    ]
  };
  
  // Generate job matches based on category scores
  const jobMatches = [];
  
  // Sort categories by score
  const sortedCategories = Object.entries(categoryScores).sort((a, b) => b[1].score - a[1].score);
  
  // Add jobs from top categories
  for (const [category, scoreData] of sortedCategories) {
    if (scoreData.score > 0) {
      for (const jobTemplate of jobTemplates[category] || []) {
        // Create a copy of the job template
        const job = { ...jobTemplate };
        
        // Add match score and keywords
        job.match_score = scoreData.score;
        job.keywords_matched = scoreData.matching_keywords;
        
        // Add a unique ID
        job.id = `${category}-${jobMatches.length + 1}`;
        
        // Add date posted (for realism)
        const daysAgo = Math.floor(Math.random() * 30) + 1;
        const datePosted = new Date();
        datePosted.setDate(datePosted.getDate() - daysAgo);
        job.date_posted = datePosted.toISOString().split('T')[0];
        
        // Generate real job search URLs
        const jobUrls = generateRealJobUrls(job.title, scoreData.matching_keywords);
        job.application_urls = jobUrls;
        job.application_url = jobUrls.indeed; // Default to Indeed
        
        jobMatches.push(job);
      }
    }
  }
  
  // Sort job matches by score
  jobMatches.sort((a, b) => b.match_score - a.match_score);
  
  // Limit to top 8 matches
  return jobMatches.slice(0, 8);
}

export async function POST(request: NextRequest) {
  try {
    const { keywords } = await request.json();
    
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: 'Invalid keywords provided' },
        { status: 400 }
      );
    }
    
    // Generate job matches based on keywords using our inline function
    const jobs = generateJobMatches(keywords);
    
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error in job search API:', error);
    return NextResponse.json(
      { error: 'Failed to search for jobs' },
      { status: 500 }
    );
  }
}
