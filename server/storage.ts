import {
  UserProfile,
  AccessibilityPreferences,
  LearningPreferences,
  Skill,
  AssessmentQuestion,
  AssessmentResult,
  LearningModule,
  CareerPath,
  CareerRoadmap,
  ChatMessage,
  AnalyticsData,
  LearningResource
} from '../src/types.js';

export class AppDataStore {
  public users: Map<string, UserProfile> = new Map();
  public accessibilityPrefs: Map<string, AccessibilityPreferences> = new Map();
  public learningPrefs: Map<string, LearningPreferences> = new Map();
  public userSkills: Map<string, Skill[]> = new Map();
  public assessments: Map<string, AssessmentResult[]> = new Map();
  public learningModules: Map<string, LearningModule[]> = new Map();
  public careerRoadmaps: Map<string, CareerRoadmap> = new Map();
  public chatHistories: Map<string, ChatMessage[]> = new Map();
  public savedResources: Map<string, Set<string>> = new Map();

  constructor() {
    this.seedDemoData();
  }

  public seedDemoData() {
    // Seed Demo User 1: Alex - Aspiring Data Scientist
    const alexProfile: UserProfile = {
      id: 'demo-alex',
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      ageRange: '20-25',
      educationLevel: 'Undergraduate',
      courseOrDegree: 'B.S. in Computer Science',
      currentOccupation: 'Student / Junior Developer',
      experienceLevel: 'intermediate',
      interests: ['Artificial Intelligence', 'Data Science', 'Machine Learning', 'Statistics'],
      targetCareerId: 'career-data-scientist',
      targetCareerTitle: 'Data Scientist',
      createdAt: new Date().toISOString(),
      isDemoUser: true
    };

    const alexAccessibility: AccessibilityPreferences = {
      fontSize: 'normal',
      contrastMode: 'default',
      dyslexicFont: false,
      reducedMotion: false,
      textSpacing: false,
      simplifiedUI: false,
      captionsEnabled: true,
      textToSpeech: true,
      speechToText: true,
      screenReaderOptimized: false,
      autoAudioExplanations: false
    };

    const alexLearningPrefs: LearningPreferences = {
      primaryLanguage: 'en',
      learningStyles: ['interactive', 'project', 'visual'],
      dailyGoalMinutes: 35,
      explanationDepth: 'balanced',
      pace: 'moderate'
    };

    const alexSkills: Skill[] = [
      {
        id: 'skill-python',
        name: 'Python for Data',
        category: 'Technical',
        currentLevel: 80,
        targetLevel: 90,
        status: 'developing',
        priority: 'medium',
        lastEvaluated: '2026-08-10',
        recommendedActions: ['Practice Vectorized NumPy & Pandas optimizations']
      },
      {
        id: 'skill-sql',
        name: 'SQL & Data Warehousing',
        category: 'Technical',
        currentLevel: 62,
        targetLevel: 85,
        status: 'developing',
        priority: 'high',
        lastEvaluated: '2026-08-10',
        recommendedActions: ['Master window functions and partitioning']
      },
      {
        id: 'skill-stats',
        name: 'Inferential Statistics & Probability',
        category: 'Analytical',
        currentLevel: 35,
        targetLevel: 85,
        status: 'critical-gap',
        priority: 'high',
        lastEvaluated: '2026-08-10',
        recommendedActions: ['Study Bayes Theorem, Hypothesis Testing & P-values']
      },
      {
        id: 'skill-ml',
        name: 'Machine Learning Algorithms',
        category: 'Technical',
        currentLevel: 42,
        targetLevel: 80,
        status: 'critical-gap',
        priority: 'high',
        lastEvaluated: '2026-08-10',
        recommendedActions: ['Implement Random Forests & Gradient Boosting from scratch']
      },
      {
        id: 'skill-dataviz',
        name: 'Data Storytelling & Visualization',
        category: 'Analytical',
        currentLevel: 72,
        targetLevel: 80,
        status: 'developing',
        priority: 'low',
        lastEvaluated: '2026-08-10',
        recommendedActions: ['Build interactive dashboard with Plotly/Seaborn']
      },
      {
        id: 'skill-comm',
        name: 'Technical Communication & Stakeholder Pitching',
        category: 'Soft Skills',
        currentLevel: 65,
        targetLevel: 80,
        status: 'developing',
        priority: 'medium',
        lastEvaluated: '2026-08-10',
        recommendedActions: ['Practice translating model metrics into business ROI']
      }
    ];

    const alexModules: LearningModule[] = [
      {
        id: 'mod-stats-prob',
        title: 'Mastering Probability & Bayes Theorem',
        phaseNumber: 1,
        phaseTitle: 'Phase 1: Mathematical & Statistical Foundations',
        estimatedMinutes: 25,
        skillTarget: 'Inferential Statistics & Probability',
        difficulty: 'Beginner',
        status: 'in-progress',
        objectives: [
          'Understand conditional probability and independent events intuitively',
          'Derive and calculate Bayes Theorem for real-world testing scenarios',
          'Distinguish between Prior, Likelihood, and Posterior probability'
        ],
        summary: 'A foundational dive into probability theory tailored for predictive AI systems, with step-by-step visual analogies.',
        contentMarkdown: `### 1. The Core Idea of Probability

Probability is the mathematical measurement of uncertainty. When designing machine learning models or analyzing user behavior, we rarely deal with deterministic truths; instead, we work with confidence levels.

$$P(A) = \\frac{\\text{Favorable Outcomes}}{\\text{Total Possible Outcomes}}$$

---

### 2. Conditional Probability: What changes when we have evidence?

Conditional probability represents the likelihood of an event $A$ occurring **given that event $B$ has already occurred**, denoted as $P(A|B)$.

$$P(A|B) = \\frac{P(A \\cap B)}{P(B)}$$

*Real World Analogy:*
Imagine you are predicting whether it will rain today ($A$). Without any clues, your baseline probability might be 15%. But if you look out the window and see heavy dark storm clouds ($B$), your conditional probability $P(\\text{Rain} | \\text{Storm Clouds})$ shoots up to 85%!

---

### 3. Bayes Theorem: Updating Beliefs with Data

Bayes Theorem is the bedrock of modern Bayesian inference, spam filtering, and medical diagnosis algorithms:

$$P(\\text{Hypothesis}|\\text{Evidence}) = \\frac{P(\\text{Evidence}|\\text{Hypothesis}) \\times P(\\text{Hypothesis})}{P(\\text{Evidence})}$$

- **Prior Probability $P(H)$:** What you believed before seeing the new evidence.
- **Likelihood $P(E|H)$:** How likely the evidence is if the hypothesis is true.
- **Posterior Probability $P(H|E)$:** Your updated belief after incorporating the evidence.`,
        keyTakeaways: [
          'Prior knowledge + New evidence = Updated posterior belief',
          'Conditional probability accounts for known constraints and context',
          'Crucial for Naive Bayes classifiers, A/B testing, and anomaly detection'
        ],
        practicalExercise: {
          title: 'Calculate Posterior Probability for Disease Screening',
          prompt: 'A rare condition affects 1 in 1000 people (0.1%). A test is 99% accurate (true positive rate). If a random patient tests positive, what is the actual probability they have the disease?',
          sampleSolution: 'Using Bayes Theorem:\nP(Disease) = 0.001\nP(Healthy) = 0.999\nP(+|Disease) = 0.99\nP(+|Healthy) = 0.01 (1% false positive)\n\nP(+) = (0.99 * 0.001) + (0.01 * 0.999) = 0.00099 + 0.00999 = 0.01098\n\nP(Disease|+) = (0.99 * 0.001) / 0.01098 = 0.00099 / 0.01098 ≈ 9.01%\n\nInsight: Because the disease is rare, even with a 99% accurate test, a positive result only indicates ~9% chance without confirmatory testing!',
          starterCode: `def bayes_theorem(prior, sensitivity, false_positive_rate):
    # Calculate P(Evidence)
    p_evidence = (sensitivity * prior) + (false_positive_rate * (1 - prior))
    # Calculate Posterior P(Hypothesis | Evidence)
    posterior = (sensitivity * prior) / p_evidence
    return posterior

# Test with 0.1% prevalence
result = bayes_theorem(0.001, 0.99, 0.01)
print(f"Posterior Probability: {result * 100:.2f}%")`
        },
        quiz: [
          {
            id: 'q1',
            question: 'What does P(A|B) represent in probability theory?',
            options: [
              'The probability of both A and B occurring independently',
              'The probability of event A occurring given that B has already occurred',
              'The ratio of event A divided by event B',
              'The probability of neither A nor B occurring'
            ],
            correctIndex: 1,
            explanation: 'P(A|B) is conditional probability: the likelihood of A given the occurrence of condition B.',
            adaptiveTip: 'Remember the vertical bar "|" means "given that".'
          },
          {
            id: 'q2',
            question: 'In Bayes Theorem, what is the term for our initial belief before gathering new data?',
            options: [
              'Likelihood',
              'Posterior Probability',
              'Prior Probability',
              'Marginal Likelihood'
            ],
            correctIndex: 2,
            explanation: 'The Prior represents the baseline belief or distribution before considering new observations.',
            adaptiveTip: 'Prior means "before" in time or sequence.'
          },
          {
            id: 'q3',
            question: 'Why does a rare event have low posterior probability even with a high-accuracy positive test?',
            options: [
              'Because the math is flawed for small numbers',
              'Because false positives from the large healthy population outnumber true positives',
              'Because machine learning ignores base rates',
              'Because tests automatically decrease accuracy over time'
            ],
            correctIndex: 1,
            explanation: 'When base rate (prevalence) is extremely small, 1% false positives across a 99.9% population generates more positive test counts than the actual true positive cases.',
            adaptiveTip: 'Think about the Base Rate Fallacy: the large non-disease group dwarfs the small disease group.'
          }
        ],
        resources: [
          {
            title: 'Interactive Visual Guide to Bayesian Inference (3Blue1Brown)',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=HZGCoVF3YvM',
            durationOrPages: '15 mins'
          },
          {
            title: 'Think Stats: Probability and Statistics for Programmers',
            type: 'article',
            url: 'https://greenteapress.com/thinkstats2/',
            durationOrPages: '20 pages'
          },
          {
            title: 'Scikit-Learn Naive Bayes Implementation Docs',
            type: 'documentation',
            url: 'https://scikit-learn.org/stable/modules/naive_bayes.html',
            durationOrPages: '10 mins read'
          }
        ]
      },
      {
        id: 'mod-sql-window',
        title: 'Advanced SQL: Window Functions & Analytical Partitioning',
        phaseNumber: 2,
        phaseTitle: 'Phase 2: Data Engineering & Query Optimization',
        estimatedMinutes: 30,
        skillTarget: 'SQL & Data Warehousing',
        difficulty: 'Intermediate',
        status: 'in-progress',
        objectives: [
          'Master ROW_NUMBER(), RANK(), and DENSE_RANK()',
          'Calculate running totals and moving averages using OVER (PARTITION BY ... ORDER BY ...)',
          'Utilize LAG() and LEAD() for time-series delta analysis'
        ],
        summary: 'Level up SQL querying efficiency from standard group-bys to multi-tier analytical partitioning.',
        contentMarkdown: `### Understanding SQL Window Functions

Unlike standard \`GROUP BY\` queries which collapse rows into single aggregate values, Window Functions calculate aggregates across a partition while **retaining individual row identities**.

\`\`\`sql
SELECT 
    user_id,
    transaction_date,
    amount,
    SUM(amount) OVER (
        PARTITION BY user_id 
        ORDER BY transaction_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as cumulative_spend
FROM transactions;
\`\`\``,
        keyTakeaways: [
          'Window functions retain row granularity while computing group statistics',
          'Essential for calculating customer retention, churn velocity, and financial ledgers'
        ],
        practicalExercise: {
          title: 'Compute Day-over-Day Revenue Growth Rate',
          prompt: 'Write an analytical SQL query using LAG() to find the percentage growth in daily revenue compared to the previous day.',
          sampleSolution: `WITH daily_rev AS (
  SELECT 
    date,
    SUM(revenue) as total_rev
  FROM orders
  GROUP BY date
)
SELECT 
  date,
  total_rev,
  LAG(total_rev, 1) OVER (ORDER BY date) as prev_day_rev,
  ROUND(((total_rev - LAG(total_rev, 1) OVER (ORDER BY date)) * 100.0 / LAG(total_rev, 1) OVER (ORDER BY date)), 2) as growth_pct
FROM daily_rev;`,
          starterCode: `-- Select date and calculate percentage change from previous day\nSELECT date, revenue FROM daily_sales;`
        },
        quiz: [
          {
            id: 'sql-q1',
            question: 'What is the main distinction between GROUP BY and Window Functions in SQL?',
            options: [
              'GROUP BY is faster in all databases',
              'Window functions preserve individual rows while calculating aggregate metrics across a partition',
              'Window functions can only run on integer columns',
              'GROUP BY cannot perform SUM or AVG'
            ],
            correctIndex: 1,
            explanation: 'Window functions calculate values across a window of rows without collapsing the result set down to 1 row per group.',
            adaptiveTip: 'Think of window functions as creating an extra computed column beside existing rows.'
          }
        ],
        resources: [
          {
            title: 'PostgreSQL Official Documentation: Window Functions',
            type: 'documentation',
            url: 'https://www.postgresql.org/docs/current/tutorial-window.html',
            durationOrPages: '15 mins'
          }
        ]
      },
      {
        id: 'mod-ml-trees',
        title: 'Decision Trees, Ensembles & Random Forests',
        phaseNumber: 3,
        phaseTitle: 'Phase 3: Machine Learning & Predictive Modeling',
        estimatedMinutes: 35,
        skillTarget: 'Machine Learning Algorithms',
        difficulty: 'Intermediate',
        status: 'locked',
        objectives: [
          'Understand Gini Impurity and Information Gain',
          'Learn Bagging (Bootstrap Aggregation) mechanics in Random Forests',
          'Tune hyper-parameters like max_depth and min_samples_split to prevent overfitting'
        ],
        summary: 'Explore non-linear decision boundaries, ensemble modeling, and feature importance analysis.',
        contentMarkdown: `### Ensemble Modeling & Random Forests
Decision trees split feature spaces recursively based on metrics like Information Gain (Entropy reduction) or Gini Impurity. Random Forests mitigate tree variance through bootstrap sampling and random feature sub-spacing.`,
        keyTakeaways: [
          'Bagging reduces model variance without increasing bias',
          'Feature importance yields interpretable insights for non-technical stakeholders'
        ],
        practicalExercise: {
          title: 'Tune a Random Forest Classifier',
          prompt: 'Identify the top 3 features driving customer churn using scikit-learn feature_importances_.',
          sampleSolution: `from sklearn.ensemble import RandomForestClassifier
rf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
rf.fit(X_train, y_train)
importances = sorted(zip(X.columns, rf.feature_importances_), key=lambda x: x[1], reverse=True)
print("Top Drivers:", importances[:3])`
        },
        quiz: [],
        resources: []
      }
    ];

    const alexRoadmap: CareerRoadmap = {
      careerId: 'career-data-scientist',
      careerTitle: 'Data Scientist',
      readinessScore: {
        technicalSkills: 68,
        problemSolving: 72,
        projects: 55,
        communication: 65,
        portfolio: 45,
        overall: 63
      },
      phases: [
        {
          phaseNumber: 1,
          title: 'Foundations of Statistical Modeling & Inferential Analysis',
          durationWeeks: '4 Weeks',
          status: 'in-progress',
          description: 'Bridge the critical gap in probability, Bayes theorem, hypothesis testing, and continuous distributions.',
          milestones: [
            { id: 'm1', title: 'Complete Bayes Theorem & Hypothesis Testing modules', type: 'course', completed: true, skillsAwarded: ['Statistics', 'Hypothesis Testing'] },
            { id: 'm2', title: 'Simulate Monte Carlo probability distributions in Python', type: 'project', completed: false, skillsAwarded: ['Python', 'Probability Modeling'] }
          ]
        },
        {
          phaseNumber: 2,
          title: 'Advanced Data Pipelines & Production SQL',
          durationWeeks: '3 Weeks',
          status: 'in-progress',
          description: 'Elevate data extraction proficiency with window functions, CTEs, and automated ETL pipelines.',
          milestones: [
            { id: 'm3', title: 'Master Window Functions & Partitioning', type: 'course', completed: true, skillsAwarded: ['SQL', 'Data Warehousing'] },
            { id: 'm4', title: 'Build automated data extraction pipeline for real estate market trends', type: 'project', completed: false, skillsAwarded: ['Data Engineering', 'ETL'] }
          ]
        },
        {
          phaseNumber: 3,
          title: 'Machine Learning Engineering & Production Systems',
          durationWeeks: '5 Weeks',
          status: 'upcoming',
          description: 'Master Supervised & Unsupervised algorithms, Gradient Boosters (XGBoost/LightGBM), and MLflow deployment.',
          milestones: [
            { id: 'm5', title: 'Implement Random Forest & Gradient Boosting models', type: 'course', completed: false, skillsAwarded: ['Machine Learning', 'Model Evaluation'] },
            { id: 'm6', title: 'End-to-end Predictive Churn API deployed on FastAPI/Cloud Run', type: 'project', completed: false, skillsAwarded: ['MLOps', 'FastAPI'] }
          ]
        },
        {
          phaseNumber: 4,
          title: 'Capstone Projects & Public Portfolio Development',
          durationWeeks: '3 Weeks',
          status: 'upcoming',
          description: 'Build polished open-source GitHub repositories, interactive Streamlit/React dashboards, and technical articles.',
          milestones: [
            { id: 'm7', title: 'Publish Healthcare Outcome Prediction system with SHAP explainability', type: 'portfolio', completed: false, skillsAwarded: ['Explainable AI', 'Data Storytelling'] }
          ]
        },
        {
          phaseNumber: 5,
          title: 'Interview Mastery & Technical Deep Dives',
          durationWeeks: '2 Weeks',
          status: 'upcoming',
          description: 'Mock data science case studies, live coding challenges, system architecture design, and behavioral storytelling.',
          milestones: [
            { id: 'm8', title: 'Complete 25 LeetCode Medium SQL & Python Algorithms', type: 'interview-prep', completed: false, skillsAwarded: ['Problem Solving', 'Live Coding'] }
          ]
        }
      ],
      capstoneProjects: [
        {
          id: 'proj-1',
          title: 'Adaptive Customer Lifetime Value & Churn Predictor',
          description: 'A production-grade machine learning system using XGBoost, featuring feature importance dashboards and automated cohort segmentation.',
          difficulty: 'Intermediate',
          skillsTrained: ['Python', 'XGBoost', 'Feature Engineering', 'FastAPI'],
          deliverables: ['GitHub Repository', 'Interactive Live Demo', 'Model Card & Documentation']
        },
        {
          id: 'proj-2',
          title: 'Explainable AI Health Risk Scoring Engine',
          description: 'Utilize SHAP and LIME values to build a medical risk assessment assistant with transparent, ethical reasoning for clinicians.',
          difficulty: 'Advanced',
          skillsTrained: ['Explainable AI', 'Statistics', 'Ethics in AI', 'React Visualization'],
          deliverables: ['Streamlit / React Application', 'Benchmark Paper Summary']
        }
      ],
      interviewPrepTopics: [
        'How to handle class imbalance in fraud detection datasets (SMOTE vs Cost-sensitive learning)',
        'Explain the Bias-Variance tradeoff to a non-technical product manager',
        'How does gradient descent differ between Batch, Mini-batch, and Stochastic modes?',
        'Design an A/B test framework for evaluating an e-commerce search algorithm change',
        'Write an optimal SQL query to find the top 3 highest spending customers per country'
      ]
    };

    const alexChat: ChatMessage[] = [
      {
        id: 'msg-1',
        sender: 'assistant',
        text: 'Hello Alex! I am your AI Learning & Career Tutor. I have reviewed your skill assessment: you have strong Python skills (80%), but we have identified a critical knowledge gap in Probability & Inferential Statistics (35%). How can I help you tackle this today?',
        language: 'en',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        simplifiedVersion: 'Hi Alex! You are doing great in Python, but you need to practice probability and statistics to reach your Data Scientist goal. What would you like to learn?',
        suggestedFollowups: [
          'Explain Bayes Theorem with a simple real-life example',
          'Why is statistics so important for Data Science?',
          'Explain this in Hindi or Kannada',
          'Give me a practice problem on conditional probability'
        ]
      }
    ];

    this.users.set(alexProfile.id, alexProfile);
    this.accessibilityPrefs.set(alexProfile.id, alexAccessibility);
    this.learningPrefs.set(alexProfile.id, alexLearningPrefs);
    this.userSkills.set(alexProfile.id, alexSkills);
    this.learningModules.set(alexProfile.id, alexModules);
    this.careerRoadmaps.set(alexProfile.id, alexRoadmap);
    this.chatHistories.set(alexProfile.id, alexChat);
    this.savedResources.set(alexProfile.id, new Set(['res-stats-khan', 'res-sql-mode']));

    // Seed Demo User 2: Priya - Frontend Engineer Transitioning to AI Fullstack
    const priyaProfile: UserProfile = {
      id: 'demo-priya',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      ageRange: '25-30',
      educationLevel: 'B.Tech Graduate',
      courseOrDegree: 'Information Technology',
      currentOccupation: 'Frontend Web Developer',
      experienceLevel: 'intermediate',
      interests: ['AI Application Development', 'Fullstack Systems', 'Cloud & DevOps'],
      targetCareerId: 'career-ai-engineer',
      targetCareerTitle: 'AI Full Stack Engineer',
      createdAt: new Date().toISOString(),
      isDemoUser: true
    };

    const priyaAccessibility: AccessibilityPreferences = {
      fontSize: 'large',
      contrastMode: 'default',
      dyslexicFont: false,
      reducedMotion: true,
      textSpacing: true,
      simplifiedUI: false,
      captionsEnabled: true,
      textToSpeech: true,
      speechToText: true,
      screenReaderOptimized: false,
      autoAudioExplanations: false
    };

    const priyaLearningPrefs: LearningPreferences = {
      primaryLanguage: 'hi', // Hindi preference
      learningStyles: ['interactive', 'project', 'text'],
      dailyGoalMinutes: 45,
      explanationDepth: 'balanced',
      pace: 'intensive'
    };

    const priyaSkills: Skill[] = [
      {
        id: 'skill-react',
        name: 'React & TypeScript',
        category: 'Technical',
        currentLevel: 88,
        targetLevel: 90,
        status: 'mastered',
        priority: 'low',
        lastEvaluated: '2026-08-11',
        recommendedActions: ['Explore Server Components & Performance Profiling']
      },
      {
        id: 'skill-backend-fastapi',
        name: 'Python & FastAPI Backend',
        category: 'Technical',
        currentLevel: 45,
        targetLevel: 85,
        status: 'critical-gap',
        priority: 'high',
        lastEvaluated: '2026-08-11',
        recommendedActions: ['Build REST APIs with Pydantic validation and async handlers']
      },
      {
        id: 'skill-llm-integration',
        name: 'LLM & Gemini API Orchestration',
        category: 'Technical',
        currentLevel: 35,
        targetLevel: 90,
        status: 'critical-gap',
        priority: 'high',
        lastEvaluated: '2026-08-11',
        recommendedActions: ['Implement function calling, structured schemas, and streaming']
      },
      {
        id: 'skill-vector-db',
        name: 'RAG & Vector Databases',
        category: 'Technical',
        currentLevel: 25,
        targetLevel: 80,
        status: 'critical-gap',
        priority: 'high',
        lastEvaluated: '2026-08-11',
        recommendedActions: ['Study embeddings, cosine similarity, and Chroma/pgvector']
      }
    ];

    this.users.set(priyaProfile.id, priyaProfile);
    this.accessibilityPrefs.set(priyaProfile.id, priyaAccessibility);
    this.learningPrefs.set(priyaProfile.id, priyaLearningPrefs);
    this.userSkills.set(priyaProfile.id, priyaSkills);
    this.learningModules.set(priyaProfile.id, alexModules);
    this.savedResources.set(priyaProfile.id, new Set());
  }

  // Standard Career Library
  public getAllCareerPaths(): CareerPath[] {
    return [
      {
        id: 'career-data-scientist',
        title: 'Data Scientist',
        category: 'Data & AI',
        description: 'Derives statistical and machine learning insights from complex datasets to drive high-impact strategic business decisions.',
        matchScore: 87,
        averageSalaryIndia: '₹14,00,000 - ₹28,00,000 / yr',
        globalDemandLevel: 'Very High',
        requiredSkills: [
          { name: 'Inferential Statistics & Probability', requiredLevel: 85, importance: 'Must-Have' },
          { name: 'Python for Data', requiredLevel: 90, importance: 'Must-Have' },
          { name: 'Machine Learning Algorithms', requiredLevel: 80, importance: 'Must-Have' },
          { name: 'SQL & Data Warehousing', requiredLevel: 85, importance: 'Must-Have' },
          { name: 'Data Storytelling & Visualization', requiredLevel: 80, importance: 'Important' },
          { name: 'Technical Communication & Stakeholder Pitching', requiredLevel: 80, importance: 'Important' }
        ],
        whyMatch: {
          positives: [
            'Strong existing programming foundation in Python (80%)',
            'Solid grasp of data visualization and chart communication (72%)',
            'Strong alignment with your expressed interests in Artificial Intelligence & Statistics'
          ],
          gapsToClose: [
            'Needs improvement in Inferential Statistics & Probability (Current: 35% vs Target: 85%)',
            'Needs practical implementation of Machine Learning ensemble algorithms (Current: 42% vs Target: 80%)'
          ],
          aiInsight: 'With your coding foundation, closing the statistical modeling gap over an 8-week structured roadmap will qualify you for junior to mid-level Data Science positions.'
        },
        sampleRoles: ['Junior Data Scientist', 'Predictive Modeling Analyst', 'Quantitative Research Associate'],
        topHiringIndustries: ['Fintech', 'Healthcare & Biotech', 'E-Commerce', 'SaaS Analytics']
      },
      {
        id: 'career-ai-engineer',
        title: 'AI Full Stack Engineer',
        category: 'Software & AI',
        description: 'Builds end-to-end intelligent software applications combining modern web frontends, scalable microservices, and LLM AI orchestration.',
        matchScore: 91,
        averageSalaryIndia: '₹16,00,000 - ₹32,00,000 / yr',
        globalDemandLevel: 'Very High',
        requiredSkills: [
          { name: 'Python & FastAPI Backend', requiredLevel: 85, importance: 'Must-Have' },
          { name: 'LLM & Gemini API Orchestration', requiredLevel: 90, importance: 'Must-Have' },
          { name: 'React & TypeScript', requiredLevel: 85, importance: 'Must-Have' },
          { name: 'RAG & Vector Databases', requiredLevel: 80, importance: 'Must-Have' },
          { name: 'Cloud & Container Deployment', requiredLevel: 75, importance: 'Important' }
        ],
        whyMatch: {
          positives: [
            'Excellent modern web frontend foundation with React and TypeScript',
            'Fast learner with project-based problem-solving capability'
          ],
          gapsToClose: [
            'Need to deepen Python backend API architecture (FastAPI)',
            'Need hands-on experience with Retrieval-Augmented Generation (RAG) and embedding indexes'
          ],
          aiInsight: 'High industry demand makes this an optimal pivot; mastering Gemini API function-calling and vector search will unlock immediate high-value engineering roles.'
        },
        sampleRoles: ['AI Application Developer', 'Fullstack LLM Engineer', 'GenAI Solutions Architect'],
        topHiringIndustries: ['Enterprise AI Startups', 'EdTech', 'Financial Services', 'Developer Tooling']
      },
      {
        id: 'career-data-analyst',
        title: 'Business Data Analyst',
        category: 'Data & Analytics',
        description: 'Transforms raw corporate data into intuitive dashboards, trend analyses, and actionable commercial recommendations.',
        matchScore: 82,
        averageSalaryIndia: '₹8,00,000 - ₹16,00,000 / yr',
        globalDemandLevel: 'High',
        requiredSkills: [
          { name: 'SQL & Data Warehousing', requiredLevel: 85, importance: 'Must-Have' },
          { name: 'Data Storytelling & Visualization', requiredLevel: 85, importance: 'Must-Have' },
          { name: 'Python for Data', requiredLevel: 70, importance: 'Important' },
          { name: 'Business Metrics & KPI Modeling', requiredLevel: 80, importance: 'Must-Have' }
        ],
        whyMatch: {
          positives: [
            'High competency in data storytelling and chart interpretation (72%)',
            'Strong logic and analytical mindset'
          ],
          gapsToClose: [
            'Refine advanced SQL queries (window functions, query plan optimization)'
          ],
          aiInsight: 'A quick entry point into the data industry with immediate job openings; you can transition to Data Science after 1-2 years.'
        },
        sampleRoles: ['Data Analyst', 'BI Developer', 'Product Performance Analyst'],
        topHiringIndustries: ['Retail', 'Banking', 'Supply Chain', 'Media']
      },
      {
        id: 'career-cloud-devops',
        title: 'Cloud & MLOps Engineer',
        category: 'Infrastructure & DevOps',
        description: 'Automates cloud infrastructure, continuous deployment pipelines, and operational monitoring for AI and backend workloads.',
        matchScore: 74,
        averageSalaryIndia: '₹15,00,000 - ₹30,00,000 / yr',
        globalDemandLevel: 'Very High',
        requiredSkills: [
          { name: 'Docker & Kubernetes', requiredLevel: 85, importance: 'Must-Have' },
          { name: 'CI/CD Pipelines (GitHub Actions)', requiredLevel: 80, importance: 'Must-Have' },
          { name: 'Cloud Platforms (GCP / AWS)', requiredLevel: 85, importance: 'Must-Have' },
          { name: 'Model Monitoring & MLflow', requiredLevel: 75, importance: 'Important' }
        ],
        whyMatch: {
          positives: ['Strong technical aptitude and interest in distributed systems'],
          gapsToClose: ['Requires dedicated study of infrastructure-as-code and container networking'],
          aiInsight: 'Great long-term career for those who love reliable system architecture and production uptime.'
        },
        sampleRoles: ['MLOps Engineer', 'Cloud Platform Engineer', 'DevOps Specialist'],
        topHiringIndustries: ['Cloud Providers', 'Large Tech Enterprises', 'Autonomous Tech']
      }
    ];
  }

  // Curated Resources Library
  public getAllResources(): LearningResource[] {
    return [
      {
        id: 'res-stats-khan',
        title: 'Probability & Statistics Fundamentals (Khan Academy)',
        type: 'course',
        skillGap: 'Inferential Statistics & Probability',
        difficulty: 'Beginner',
        language: 'en',
        url: 'https://www.khanacademy.org/math/statistics-probability',
        source: 'Khan Academy',
        description: 'Comprehensive video tutorials and practice problems for distributions, probability, and p-values.'
      },
      {
        id: 'res-stats-3b1b',
        title: 'Essence of Probability & Bayes Theorem Visualized',
        type: 'video',
        skillGap: 'Inferential Statistics & Probability',
        difficulty: 'Beginner',
        language: 'en',
        url: 'https://www.3blue1brown.com/topics/probability',
        source: '3Blue1Brown',
        description: 'World-class visual animations breaking down complex geometric intuition behind Bayes Theorem.'
      },
      {
        id: 'res-sql-mode',
        title: 'The Advanced SQL Tutorial for Data Analysis',
        type: 'documentation',
        skillGap: 'SQL & Data Warehousing',
        difficulty: 'Intermediate',
        language: 'en',
        url: 'https://mode.com/sql-tutorial/sql-window-functions/',
        source: 'Mode Analytics',
        description: 'Interactive browser-based SQL queries mastering window functions, partitions, and subqueries.'
      },
      {
        id: 'res-ml-fastai',
        title: 'Practical Deep Learning for Coders',
        type: 'course',
        skillGap: 'Machine Learning Algorithms',
        difficulty: 'Intermediate',
        language: 'en',
        url: 'https://course.fast.ai/',
        source: 'fast.ai',
        description: 'Top-down pragmatic approach to training neural networks and random forest classifiers.'
      },
      {
        id: 'res-gemini-docs',
        title: 'Building Production AI Apps with Google GenAI SDK',
        type: 'documentation',
        skillGap: 'LLM & Gemini API Orchestration',
        difficulty: 'Intermediate',
        language: 'en',
        url: 'https://ai.google.dev/gemini-api/docs',
        source: 'Google AI Studio',
        description: 'Official developer guides covering structured outputs, function calling, and system prompts.'
      },
      {
        id: 'res-project-churn',
        title: 'End-to-End Customer Churn Prediction Repository',
        type: 'project',
        skillGap: 'Machine Learning Algorithms',
        difficulty: 'Intermediate',
        language: 'en',
        url: 'https://github.com/topics/churn-prediction',
        source: 'Open Source GitHub',
        description: 'Hands-on repository complete with feature pipeline, hyper-parameter tuning, and FastAPI deployment.'
      }
    ];
  }

  // Pre-configured assessment questions library
  public getAssessmentQuestionsForCareer(careerId: string): AssessmentQuestion[] {
    if (careerId === 'career-ai-engineer') {
      return [
        {
          id: 'q-ai-1',
          skillId: 'skill-llm-integration',
          skillName: 'LLM & Gemini API Orchestration',
          questionText: 'When sending structured requests to an LLM where you need a deterministic JSON object matching a schema, what is the best practice?',
          difficulty: 'intermediate',
          options: [
            { id: 'a', text: 'Ask the LLM in plain text to output JSON and hope it follows rules', isCorrect: false, explanation: 'Plain text prompts frequently produce markdown ticks or hallucinated schemas.' },
            { id: 'b', text: 'Configure responseMimeType to application/json and define a strict responseSchema', isCorrect: true, explanation: 'Native schema constraints force the model token decoder to guarantee valid JSON adhering to the specified types.' },
            { id: 'c', text: 'Increase temperature to 1.5 to encourage strict grammar', isCorrect: false, explanation: 'Higher temperature increases randomness, worsening schema compliance.' },
            { id: 'd', text: 'Run regex search on raw output', isCorrect: false, explanation: 'Regex extraction is brittle and fails on complex nested payloads.' }
          ],
          codeSnippet: 'const response = await ai.models.generateContent({\n  model: "gemini-3.7-flash",\n  config: { responseMimeType: "application/json", responseSchema: { ... } }\n});'
        },
        {
          id: 'q-ai-2',
          skillId: 'skill-backend-fastapi',
          skillName: 'Python & FastAPI Backend',
          questionText: 'What is the primary advantage of using Pydantic models in FastAPI endpoint route signatures?',
          difficulty: 'beginner',
          options: [
            { id: 'a', text: 'Automatic data validation, serialization, and OpenAPI documentation generation', isCorrect: true, explanation: 'FastAPI uses Pydantic to validate request payloads at runtime and auto-document schemas in Swagger.' },
            { id: 'b', text: 'It speeds up database CPU execution by 10x', isCorrect: false, explanation: 'Pydantic handles validation and serialization, not database execution.' },
            { id: 'c', text: 'It converts Python code to C++ at runtime', isCorrect: false, explanation: 'Pydantic v2 core is written in Rust, but does not compile user code to C++.' },
            { id: 'd', text: 'It replaces the need for an HTTP server', isCorrect: false, explanation: 'FastAPI still requires an ASGI server like Uvicorn.' }
          ]
        },
        {
          id: 'q-ai-3',
          skillId: 'skill-vector-db',
          skillName: 'RAG & Vector Databases',
          questionText: 'In a Retrieval-Augmented Generation (RAG) system, what metric is most commonly calculated between a query embedding and document chunk embeddings to find top relevant context?',
          difficulty: 'intermediate',
          options: [
            { id: 'a', text: 'Cosine Similarity or Dot Product distance', isCorrect: true, explanation: 'Cosine similarity measures the angle between normalized vector embeddings in semantic space.' },
            { id: 'b', text: 'Hamming distance on plain text strings', isCorrect: false, explanation: 'Hamming distance operates on discrete characters rather than dense semantic vectors.' },
            { id: 'c', text: 'Levenshtein edit distance', isCorrect: false, explanation: 'Edit distance is lexical, not semantic.' },
            { id: 'd', text: 'Alphabetical sorting index', isCorrect: false, explanation: 'Alphabetical order bears no relationship to semantic topic similarity.' }
          ]
        }
      ];
    }

    // Data Analyst questions
    if (careerId === 'career-data-analyst') {
      return [
        {
          id: 'q-da-1',
          skillId: 'skill-sql-da',
          skillName: 'SQL & Data Warehousing',
          questionText: 'When would you use a LEFT JOIN instead of an INNER JOIN in a business analytics query?',
          difficulty: 'beginner',
          options: [
            { id: 'a', text: 'When you want all rows from the left table regardless of whether there is a match in the right table', isCorrect: true, explanation: 'LEFT JOIN preserves every record from the left table and fills non-matching right table columns with NULL.' },
            { id: 'b', text: 'When you want only records that exist in both tables', isCorrect: false, explanation: 'That is the definition of an INNER JOIN.' },
            { id: 'c', text: 'When sorting records alphabetically', isCorrect: false, explanation: 'Sorting is handled by ORDER BY.' },
            { id: 'd', text: 'When deleting records from the database', isCorrect: false, explanation: 'JOINs query data, they do not delete records.' }
          ]
        },
        {
          id: 'q-da-2',
          skillId: 'skill-kpi',
          skillName: 'Business Metrics & KPI Modeling',
          questionText: 'How is Customer Churn Rate calculated over a monthly cohort?',
          difficulty: 'intermediate',
          options: [
            { id: 'a', text: '(Customers lost during month / Total customers at start of month) * 100', isCorrect: true, explanation: 'Churn rate is the percentage of existing users who cancel or churn within the measurement period.' },
            { id: 'b', text: 'Total revenue divided by marketing budget', isCorrect: false, explanation: 'That is Return on Ad Spend (ROAS).' },
            { id: 'c', text: 'New customers acquired minus support tickets', isCorrect: false, explanation: 'This is not a recognized customer lifecycle metric.' },
            { id: 'd', text: 'Average order value multiplied by total website visitors', isCorrect: false, explanation: 'This calculates potential gross merchandise value.' }
          ]
        }
      ];
    }

    // Default / Data Scientist questions
    return [
      {
        id: 'q-ds-1',
        skillId: 'skill-stats',
        skillName: 'Inferential Statistics & Probability',
        questionText: 'In hypothesis testing, what does a p-value of 0.03 mean at a significance level (alpha) of 0.05?',
        difficulty: 'intermediate',
        options: [
          { id: 'a', text: 'There is a 97% probability that the null hypothesis is true', isCorrect: false, explanation: 'A p-value is not the probability of the hypothesis itself; it is the probability of the observed data assuming the null hypothesis is true.' },
          { id: 'b', text: 'We reject the null hypothesis because p < 0.05, indicating statistically significant evidence against it', isCorrect: true, explanation: 'Since the p-value (0.03) is below the significance threshold (0.05), we reject the null hypothesis in favor of the alternative.' },
          { id: 'c', text: 'The experiment was faulty and must be rerun', isCorrect: false, explanation: 'A low p-value does not mean an error occurred.' },
          { id: 'd', text: 'The effect size is guaranteed to be clinically or commercially huge', isCorrect: false, explanation: 'Statistical significance does not directly measure practical effect magnitude.' }
        ]
      },
      {
        id: 'q-ds-2',
        skillId: 'skill-python',
        skillName: 'Python for Data',
        questionText: 'In Pandas, why is vectorized operation (e.g. df["a"] + df["b"]) significantly faster than iterating with a Python for-loop or apply()?',
        difficulty: 'intermediate',
        options: [
          { id: 'a', text: 'Vectorized operations execute in compiled C/Cython with contiguous memory arrays (SIMD optimization)', isCorrect: true, explanation: 'NumPy and Pandas leverage compiled C-extensions and contiguous memory blocks, avoiding Python interpreter loop overhead.' },
          { id: 'b', text: 'Pandas runs each row in a separate OS thread automatically', isCorrect: false, explanation: 'Standard Pandas operations are single-threaded unless using Dask/Polars.' },
          { id: 'c', text: 'It compresses data into zip format during calculation', isCorrect: false, explanation: 'Data compression is not involved in vector math.' },
          { id: 'd', text: 'Python for-loops are prohibited by the language syntax in Pandas', isCorrect: false, explanation: 'For-loops are syntactically valid in Python, but inefficient for numerical arrays.' }
        ]
      },
      {
        id: 'q-ds-3',
        skillId: 'skill-ml',
        skillName: 'Machine Learning Algorithms',
        questionText: 'What is the primary purpose of cross-validation (such as 5-Fold Cross Validation) when training a machine learning model?',
        difficulty: 'beginner',
        options: [
          { id: 'a', text: 'To estimate how well the model generalizes to unseen data and detect overfitting', isCorrect: true, explanation: 'Cross-validation tests model stability across multiple validation slices, providing reliable generalization metrics.' },
          { id: 'b', text: 'To artificially increase the number of training samples by 5x', isCorrect: false, explanation: 'Cross-validation partitions existing data; it does not generate synthetic samples like SMOTE.' },
          { id: 'c', text: 'To automatically convert categorical strings into integers', isCorrect: false, explanation: 'Categorical encoding is performed by encoders, not cross-validation.' },
          { id: 'd', text: 'To eliminate the need for feature engineering', isCorrect: false, explanation: 'Feature engineering remains vital regardless of validation strategy.' }
        ]
      },
      {
        id: 'q-ds-4',
        skillId: 'skill-sql',
        skillName: 'SQL & Data Warehousing',
        questionText: 'Which SQL clause is used to filter aggregated group results (e.g. groups where COUNT(*) > 5)?',
        difficulty: 'beginner',
        options: [
          { id: 'a', text: 'WHERE', isCorrect: false, explanation: 'WHERE filters individual records BEFORE aggregation occurs.' },
          { id: 'b', text: 'HAVING', isCorrect: true, explanation: 'HAVING operates on aggregated results calculated after the GROUP BY phase.' },
          { id: 'c', text: 'ORDER BY', isCorrect: false, explanation: 'ORDER BY sorts output rows.' },
          { id: 'd', text: 'QUALIFY', isCorrect: false, explanation: 'QUALIFY filters window function results in specific databases (Snowflake/BigQuery).' }
        ]
      }
    ];
  }

  // ==========================================
  // DYNAMIC FRESH ROADMAP & SKILL GENERATORS
  // ==========================================

  public getBaselineSkillsForCareer(
    careerTitleOrId: string, 
    experienceLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  ): Skill[] {
    const titleLower = (careerTitleOrId || '').toLowerCase();
    const today = new Date().toISOString().split('T')[0];

    const baseOffset = experienceLevel === 'advanced' ? 45 : experienceLevel === 'intermediate' ? 25 : 0;

    if (titleLower.includes('ai full') || titleLower.includes('ai engineer') || titleLower.includes('genai') || titleLower.includes('career-ai-engineer')) {
      return [
        {
          id: 'skill-py-fastapi',
          name: 'Python & FastAPI Backend',
          category: 'Technical',
          currentLevel: Math.min(90, 18 + baseOffset),
          targetLevel: 85,
          status: 'critical-gap',
          priority: 'high',
          lastEvaluated: today,
          recommendedActions: ['Build REST APIs with Pydantic validation and async routing']
        },
        {
          id: 'skill-llm-orch',
          name: 'LLM & Gemini API Orchestration',
          category: 'Technical',
          currentLevel: Math.min(90, 15 + baseOffset),
          targetLevel: 90,
          status: 'critical-gap',
          priority: 'high',
          lastEvaluated: today,
          recommendedActions: ['Implement structured output schemas, function calling and multi-turn chat']
        },
        {
          id: 'skill-react-ts',
          name: 'React & TypeScript Frontend',
          category: 'Technical',
          currentLevel: Math.min(90, 24 + baseOffset),
          targetLevel: 85,
          status: 'critical-gap',
          priority: 'medium',
          lastEvaluated: today,
          recommendedActions: ['Build stateful UI components with responsive Tailwind layouts']
        },
        {
          id: 'skill-rag-vector',
          name: 'RAG & Vector Databases',
          category: 'Technical',
          currentLevel: Math.min(90, 10 + baseOffset),
          targetLevel: 80,
          status: 'critical-gap',
          priority: 'high',
          lastEvaluated: today,
          recommendedActions: ['Learn text embeddings, chunking strategies, and vector indexing']
        },
        {
          id: 'skill-cloud-deploy',
          name: 'Cloud & Container Deployment',
          category: 'Tooling',
          currentLevel: Math.min(90, 15 + baseOffset),
          targetLevel: 75,
          status: 'critical-gap',
          priority: 'medium',
          lastEvaluated: today,
          recommendedActions: ['Dockerize fullstack services and deploy on Cloud Run']
        }
      ];
    }

    if (titleLower.includes('analyst') || titleLower.includes('business') || titleLower.includes('career-data-analyst')) {
      return [
        {
          id: 'skill-sql-da',
          name: 'SQL & Relational Databases',
          category: 'Technical',
          currentLevel: Math.min(90, 20 + baseOffset),
          targetLevel: 85,
          status: 'critical-gap',
          priority: 'high',
          lastEvaluated: today,
          recommendedActions: ['Practice multi-table JOINs, subqueries, and window functions']
        },
        {
          id: 'skill-bi-viz',
          name: 'Data Storytelling & BI Dashboards',
          category: 'Analytical',
          currentLevel: Math.min(90, 25 + baseOffset),
          targetLevel: 85,
          status: 'critical-gap',
          priority: 'high',
          lastEvaluated: today,
          recommendedActions: ['Design executive metric dashboards and user cohort graphs']
        },
        {
          id: 'skill-py-analysis',
          name: 'Python for Exploratory Analysis',
          category: 'Technical',
          currentLevel: Math.min(90, 15 + baseOffset),
          targetLevel: 75,
          status: 'critical-gap',
          priority: 'medium',
          lastEvaluated: today,
          recommendedActions: ['Clean messy datasets with Pandas and generate Seaborn charts']
        },
        {
          id: 'skill-kpi',
          name: 'Business Metrics & KPI Modeling',
          category: 'Domain Knowledge',
          currentLevel: Math.min(90, 22 + baseOffset),
          targetLevel: 80,
          status: 'critical-gap',
          priority: 'medium',
          lastEvaluated: today,
          recommendedActions: ['Model customer churn, CAC, LTV, and conversion funnels']
        },
        {
          id: 'skill-comm-da',
          name: 'Stakeholder Communication',
          category: 'Soft Skills',
          currentLevel: Math.min(90, 30 + baseOffset),
          targetLevel: 80,
          status: 'developing',
          priority: 'low',
          lastEvaluated: today,
          recommendedActions: ['Translate technical insights into commercial revenue opportunities']
        }
      ];
    }

    if (titleLower.includes('devops') || titleLower.includes('mlops') || titleLower.includes('cloud') || titleLower.includes('career-cloud-devops')) {
      return [
        {
          id: 'skill-docker-k8s',
          name: 'Docker & Container Orchestration',
          category: 'Tooling',
          currentLevel: Math.min(90, 18 + baseOffset),
          targetLevel: 85,
          status: 'critical-gap',
          priority: 'high',
          lastEvaluated: today,
          recommendedActions: ['Write multi-stage Dockerfiles and deploy Kubernetes pods']
        },
        {
          id: 'skill-cicd',
          name: 'CI/CD Pipelines (GitHub Actions)',
          category: 'Tooling',
          currentLevel: Math.min(90, 22 + baseOffset),
          targetLevel: 80,
          status: 'critical-gap',
          priority: 'high',
          lastEvaluated: today,
          recommendedActions: ['Automate linting, unit tests, and continuous deployment workflows']
        },
        {
          id: 'skill-cloud-infra',
          name: 'Cloud Infrastructure (GCP / AWS)',
          category: 'Technical',
          currentLevel: Math.min(90, 15 + baseOffset),
          targetLevel: 85,
          status: 'critical-gap',
          priority: 'high',
          lastEvaluated: today,
          recommendedActions: ['Provision virtual networks, IAM roles, and storage buckets']
        },
        {
          id: 'skill-mlflow-mon',
          name: 'Model Monitoring & MLflow',
          category: 'Technical',
          currentLevel: Math.min(90, 10 + baseOffset),
          targetLevel: 75,
          status: 'critical-gap',
          priority: 'medium',
          lastEvaluated: today,
          recommendedActions: ['Track model experiment runs and detect real-time data drift']
        }
      ];
    }

    // Default: Data Scientist baseline
    return [
      {
        id: 'skill-python',
        name: 'Python for Data Science',
        category: 'Technical',
        currentLevel: Math.min(90, 20 + baseOffset),
        targetLevel: 90,
        status: 'critical-gap',
        priority: 'high',
        lastEvaluated: today,
        recommendedActions: ['Master NumPy array broadcasting and Pandas DataFrame operations']
      },
      {
        id: 'skill-sql',
        name: 'SQL & Data Warehousing',
        category: 'Technical',
        currentLevel: Math.min(90, 18 + baseOffset),
        targetLevel: 85,
        status: 'critical-gap',
        priority: 'high',
        lastEvaluated: today,
        recommendedActions: ['Master window functions, CTEs, and query indexing strategies']
      },
      {
        id: 'skill-stats',
        name: 'Inferential Statistics & Probability',
        category: 'Analytical',
        currentLevel: Math.min(90, 12 + baseOffset),
        targetLevel: 85,
        status: 'critical-gap',
        priority: 'high',
        lastEvaluated: today,
        recommendedActions: ['Study Bayes Theorem, hypothesis testing, and continuous distributions']
      },
      {
        id: 'skill-ml',
        name: 'Machine Learning Algorithms',
        category: 'Technical',
        currentLevel: Math.min(90, 10 + baseOffset),
        targetLevel: 80,
        status: 'critical-gap',
        priority: 'high',
        lastEvaluated: today,
        recommendedActions: ['Train and tune Random Forests, Gradient Boosters, and evaluate metrics']
      },
      {
        id: 'skill-dataviz',
        name: 'Data Storytelling & Visualization',
        category: 'Analytical',
        currentLevel: Math.min(90, 25 + baseOffset),
        targetLevel: 80,
        status: 'critical-gap',
        priority: 'medium',
        lastEvaluated: today,
        recommendedActions: ['Construct clear, high-contrast exploratory visualizations']
      }
    ];
  }

  public generateTailoredRoadmap(
    careerTitle: string, 
    careerId: string, 
    skills: Skill[]
  ): CareerRoadmap {
    const techAvg = Math.round(
      skills.reduce((acc, s) => acc + s.currentLevel, 0) / (skills.length || 1)
    );
    const overall = Math.max(15, Math.round(techAvg * 0.85 + 5));

    const isAI = careerTitle.toLowerCase().includes('ai') || careerTitle.toLowerCase().includes('genai');
    const isAnalyst = careerTitle.toLowerCase().includes('analyst') || careerTitle.toLowerCase().includes('business');
    const isCloud = careerTitle.toLowerCase().includes('devops') || careerTitle.toLowerCase().includes('cloud');

    let phases = [
      {
        phaseNumber: 1,
        title: isAI 
          ? 'Phase 1: Python API Architecture & Modern Full Stack Fundamentals'
          : isAnalyst
          ? 'Phase 1: Relational Data Modeling & Analytical SQL Foundations'
          : isCloud
          ? 'Phase 1: Linux Systems, Containers & Docker Foundations'
          : 'Phase 1: Mathematical, Statistical & Python Foundations',
        durationWeeks: '4 Weeks',
        status: 'in-progress' as const,
        description: `Establish your core technical foundation for ${careerTitle} and bridge initial skill gaps.`,
        milestones: [
          { 
            id: `m-${careerId}-1`, 
            title: isAI ? 'Build First Async REST API with FastAPI' : isAnalyst ? 'Master Multi-table JOINs & Aggregations' : 'Core Fundamentals Diagnostic Assessment', 
            type: 'course' as const, 
            completed: false, 
            skillsAwarded: [skills[0]?.name || 'Core Fundamentals'] 
          },
          { 
            id: `m-${careerId}-2`, 
            title: isAI ? 'Integrate Google Gemini API with Structured JSON' : isAnalyst ? 'Build Interactive BI Cohort Dashboard' : 'Interactive Python Problem Set', 
            type: 'project' as const, 
            completed: false, 
            skillsAwarded: [skills[1]?.name || 'Data Processing'] 
          }
        ]
      },
      {
        phaseNumber: 2,
        title: isAI 
          ? 'Phase 2: RAG Systems, Vector Embeddings & Context Injection'
          : isAnalyst
          ? 'Phase 2: Advanced Window Functions & Business KPI Modeling'
          : isCloud
          ? 'Phase 2: Kubernetes Orchestration & Automated CI/CD'
          : 'Phase 2: Advanced SQL Pipelines & Relational Engineering',
        durationWeeks: '4 Weeks',
        status: 'upcoming' as const,
        description: 'Advance from fundamental syntax to robust, production-grade logic and real-world pipelines.',
        milestones: [
          { 
            id: `m-${careerId}-3`, 
            title: isAI ? 'Implement Vector Semantic Search with ChromaDB' : 'Advanced Pipeline Case Study', 
            type: 'project' as const, 
            completed: false, 
            skillsAwarded: [skills[2]?.name || 'System Architecture'] 
          }
        ]
      },
      {
        phaseNumber: 3,
        title: isAI 
          ? 'Phase 3: Production LLM Multi-Agent Workflows & Evaluations'
          : isAnalyst
          ? 'Phase 3: Python Data Transformation & Predictive Trends'
          : isCloud
          ? 'Phase 3: Infrastructure-as-Code & Model Governance'
          : 'Phase 3: Predictive Modeling & Machine Learning Systems',
        durationWeeks: '5 Weeks',
        status: 'upcoming' as const,
        description: 'Tackle complex algorithmic challenges and design scalable end-to-end architectures.',
        milestones: [
          { 
            id: `m-${careerId}-4`, 
            title: 'End-to-End System Deployment Milestone', 
            type: 'project' as const, 
            completed: false, 
            skillsAwarded: ['Production Engineering', 'System Design'] 
          }
        ]
      },
      {
        phaseNumber: 4,
        title: 'Phase 4: Capstone Projects & Open-Source Portfolio',
        durationWeeks: '3 Weeks',
        status: 'upcoming' as const,
        description: 'Publish documented GitHub repositories, interactive web demos, and technical case studies.',
        milestones: [
          { 
            id: `m-${careerId}-5`, 
            title: `Publish ${careerTitle} Capstone Application`, 
            type: 'portfolio' as const, 
            completed: false, 
            skillsAwarded: ['Technical Storytelling', 'Portfolio Building'] 
          }
        ]
      },
      {
        phaseNumber: 5,
        title: 'Phase 5: Technical Interviews & Industry Readiness',
        durationWeeks: '2 Weeks',
        status: 'upcoming' as const,
        description: 'Live coding drills, behavioral storytelling, system design whiteboard interviews, and salary negotiation.',
        milestones: [
          { 
            id: `m-${careerId}-6`, 
            title: 'Complete 3 Mock Technical Interview Drills', 
            type: 'interview-prep' as const, 
            completed: false, 
            skillsAwarded: ['Problem Solving', 'Communication'] 
          }
        ]
      }
    ];

    let capstones = [
      {
        id: `cap-${careerId}-1`,
        title: isAI 
          ? 'Accessible Multimodal AI Tutor with Real-time Speech'
          : isAnalyst
          ? 'Executive E-Commerce Revenue & Retention Intelligence Platform'
          : isCloud
          ? 'Automated Multi-Environment GitOps Deployment Engine'
          : 'Predictive Customer Churn & Lifetime Value Machine Learning System',
        description: `Comprehensive industry-grade project demonstrating end-to-end competency in ${careerTitle}.`,
        difficulty: 'Intermediate' as const,
        skillsTrained: skills.slice(0, 4).map(s => s.name),
        deliverables: ['GitHub Repository', 'Live Cloud Demo', 'Technical Documentation']
      }
    ];

    let interviewTopics = isAI
      ? ['LLM Prompt Engineering vs Fine-Tuning tradeoffs', 'RAG Chunking & Vector Search Cosine Similarity', 'FastAPI Async Event Loop & Worker Architecture', 'Hallucination Mitigation & Output Schemas']
      : isAnalyst
      ? ['SQL Window Functions (ROW_NUMBER vs DENSE_RANK)', 'Customer Churn & Cohort Retention Analysis', 'Data Normalization vs Star Schema', 'A/B Testing Hypothesis Formulations']
      : isCloud
      ? ['Docker Container Security & Layer Caching', 'Kubernetes Deployments vs StatefulSets', 'Zero-Downtime Blue/Green Deployments', 'Cloud IAM Least-Privilege Principles']
      : ['Bias-Variance Tradeoff & Model Regularization', 'SQL Window Functions & Indexing Mechanics', 'Bayes Theorem vs Frequentist Inference', 'Cross-Validation & Metric Formulation'];

    return {
      careerId: careerId || 'career-custom',
      careerTitle: careerTitle || 'Data Scientist',
      readinessScore: {
        technicalSkills: Math.min(95, techAvg),
        problemSolving: Math.min(95, techAvg + 5),
        projects: 15,
        communication: 40,
        portfolio: 10,
        overall: Math.min(95, overall)
      },
      phases,
      capstoneProjects: capstones,
      interviewPrepTopics: interviewTopics
    };
  }

  public generateTailoredModules(
    careerTitle: string, 
    careerId: string, 
    skills: Skill[]
  ): LearningModule[] {
    const isAI = careerTitle.toLowerCase().includes('ai') || careerTitle.toLowerCase().includes('genai');
    const isAnalyst = careerTitle.toLowerCase().includes('analyst') || careerTitle.toLowerCase().includes('business');
    const isCloud = careerTitle.toLowerCase().includes('devops') || careerTitle.toLowerCase().includes('cloud');

    if (isAI) {
      return [
        {
          id: 'mod-ai-fastapi',
          title: 'Building Scalable APIs with Python & FastAPI',
          phaseNumber: 1,
          phaseTitle: 'Phase 1: Python API Architecture & Full Stack Fundamentals',
          estimatedMinutes: 25,
          skillTarget: skills[0]?.name || 'Python & FastAPI Backend',
          difficulty: 'Beginner',
          status: 'in-progress',
          objectives: [
            'Understand ASGI architecture and asynchronous endpoints in FastAPI',
            'Validate request bodies with Pydantic type definitions',
            'Handle CORS and error middleware securely'
          ],
          summary: 'Learn how modern AI backends use FastAPI to serve high-throughput inference endpoints with automatic OpenAPI documentation.',
          contentMarkdown: `### Modern AI Backend with FastAPI
FastAPI leverages Python type hints and Pydantic models to deliver lightning-fast REST endpoints with native asynchronous execution.

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class QueryRequest(BaseModel):
    query: str
    temperature: float = 0.7

@app.post("/api/ask")
async def ask(payload: QueryRequest):
    return {"status": "ok", "query": payload.query}
\`\`\``,
          keyTakeaways: [
            'Pydantic automates schema validation and eliminates runtime type bugs',
            'Async route definitions prevent blocking thread execution during LLM calls'
          ],
          practicalExercise: {
            title: 'Define an AI Inference Request Handler',
            prompt: 'Write a FastAPI POST endpoint that accepts a prompt and maxTokens parameter using Pydantic.',
            starterCode: `from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\n# Define Pydantic Schema and Route here`,
            sampleSolution: `from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass PromptModel(BaseModel):\n    prompt: str\n    maxTokens: int = 100\n\n@app.post("/generate")\nasync def generate(data: PromptModel):\n    return {"received": data.prompt, "tokens": data.maxTokens}`
          },
          quiz: [
            {
              id: 'q-mod-fastapi-1',
              question: 'Why is async def preferred over standard def for FastAPI routes that call external AI APIs?',
              options: [
                'It reduces memory usage by 90%',
                'It releases the event loop worker while awaiting network I/O, allowing concurrent requests to proceed',
                'It compiles Python to machine bytecode ahead of time',
                'Standard def is deprecated in Python 3'
              ],
              correctIndex: 1,
              explanation: 'Async functions allow the single-threaded event loop to handle other incoming requests while waiting for the AI model network response.',
              adaptiveTip: 'Think of async as delegating waiting time so your server never freezes.'
            }
          ],
          resources: [
            {
              title: 'FastAPI Official Tutorial - First Steps',
              type: 'documentation',
              url: 'https://fastapi.tiangolo.com/tutorial/first-steps/',
              durationOrPages: '15 mins'
            }
          ]
        },
        {
          id: 'mod-ai-gemini',
          title: 'Structured Outputs & Function Calling with Gemini API',
          phaseNumber: 1,
          phaseTitle: 'Phase 1: Python API Architecture & Full Stack Fundamentals',
          estimatedMinutes: 30,
          skillTarget: skills[1]?.name || 'LLM & Gemini API Orchestration',
          difficulty: 'Intermediate',
          status: 'locked',
          objectives: [
            'Enforce JSON schema constraints using responseSchema',
            'Implement function calling tools for external computation',
            'Handle streaming responses for smooth UX'
          ],
          summary: 'Master deterministic structured outputs and tool calling using the Google GenAI SDK.',
          contentMarkdown: `### Deterministic JSON with Google GenAI
By configuring \`responseMimeType: "application/json"\` alongside a defined schema, Gemini guarantees output adhering to your data types.`,
          keyTakeaways: [
            'Never rely on prompt text alone for JSON output; use strict schema parameters',
            'Tool calling connects generative models to databases and live APIs'
          ],
          practicalExercise: {
            title: 'Configure a Schema-Constrained Gemini Call',
            prompt: 'Set up an API call that returns a list of actionable learning topics with title and difficulty level.',
            starterCode: `import { GoogleGenAI, Type } from "@google/genai";\nconst ai = new GoogleGenAI();`,
            sampleSolution: `const response = await ai.models.generateContent({\n  model: 'gemini-2.5-flash',\n  contents: 'Generate 3 data science topics',\n  config: {\n    responseMimeType: 'application/json'\n  }\n});`
          },
          quiz: [
            {
              id: 'q-mod-gem-1',
              question: 'Which model parameter guarantees deterministic output adhering to strict types?',
              options: [
                'Higher temperature (1.8)',
                'responseMimeType: "application/json" with responseSchema definition',
                'Setting topK to 1',
                'Adding "Please output valid JSON" to the prompt'
              ],
              correctIndex: 1,
              explanation: 'Configuring native responseSchema forces token generation to adhere to strict schema constraints at the decoder level.',
              adaptiveTip: 'Native schema constraints are enforced by the grammar engine.'
            }
          ],
          resources: []
        }
      ];
    }

    if (isAnalyst) {
      return [
        {
          id: 'mod-da-sql-joins',
          title: 'Relational Joins, Aggregations & Data Warehousing',
          phaseNumber: 1,
          phaseTitle: 'Phase 1: Relational Data Modeling & Analytical SQL Foundations',
          estimatedMinutes: 20,
          skillTarget: skills[0]?.name || 'SQL & Relational Databases',
          difficulty: 'Beginner',
          status: 'in-progress',
          objectives: [
            'Master INNER, LEFT, RIGHT, and FULL OUTER joins',
            'Filter post-aggregated groups using the HAVING clause',
            'Optimize indexing on foreign key joins'
          ],
          summary: 'Learn how to query large relational tables to extract core business metrics and customer cohorts.',
          contentMarkdown: `### Relational Joins in SQL
Joins combine rows from two or more tables based on related columns.`,
          keyTakeaways: [
            'Use LEFT JOIN when retaining unmatched primary entities is required',
            'WHERE filters rows before grouping; HAVING filters after grouping'
          ],
          practicalExercise: {
            title: 'Aggregate Monthly Revenue by Customer Segment',
            prompt: 'Write a query joining customers and transactions to calculate total spend per tier.',
            starterCode: `SELECT c.segment, SUM(t.amount) AS total_revenue\nFROM customers c\n-- Complete JOIN and GROUP BY`,
            sampleSolution: `SELECT c.segment, SUM(t.amount) AS total_revenue\nFROM customers c\nJOIN transactions t ON c.id = t.customer_id\nGROUP BY c.segment\nHAVING SUM(t.amount) > 1000;`
          },
          quiz: [
            {
              id: 'q-mod-da-1',
              question: 'What is the key difference between WHERE and HAVING in SQL?',
              options: [
                'HAVING is faster than WHERE in all scenarios',
                'WHERE filters individual rows prior to aggregation; HAVING filters aggregated groups',
                'WHERE can only be used on string columns',
                'There is no difference'
              ],
              correctIndex: 1,
              explanation: 'WHERE executes before GROUP BY, while HAVING filters the computed aggregate summary values.',
              adaptiveTip: 'Remember: WHERE filters records, HAVING filters groups.'
            }
          ],
          resources: []
        }
      ];
    }

    // Default Data Science modules
    return [
      {
        id: 'mod-stats-prob-fresh',
        title: 'Probability & Bayes Theorem Foundations',
        phaseNumber: 1,
        phaseTitle: 'Phase 1: Mathematical, Statistical & Python Foundations',
        estimatedMinutes: 25,
        skillTarget: skills[2]?.name || 'Inferential Statistics & Probability',
        difficulty: 'Beginner',
        status: 'in-progress',
        objectives: [
          'Master conditional probability and independence',
          'Calculate posterior probabilities using Bayes Theorem: P(A|B) = P(B|A)*P(A) / P(B)',
          'Avoid the Base Rate Fallacy in diagnostic testing'
        ],
        summary: 'Establish the core mathematical intuition behind Bayesian reasoning and probabilistic modeling.',
        contentMarkdown: `### Bayesian Probability
Bayes theorem updates the prior belief $P(A)$ with new observed evidence $B$ to compute the posterior $P(A|B)$.

$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$`,
        keyTakeaways: [
          'Prior probabilities dominate outcomes when base rates are rare',
          'Bayesian updates form the backbone of machine learning classification'
        ],
        practicalExercise: {
          title: 'Calculate Posterior Disease Probability',
          prompt: 'Implement Bayes theorem in Python given prior prevalence of 0.01, sensitivity of 0.95, and false alarm rate of 0.05.',
          starterCode: `def bayes_posterior(prior, true_positive, false_positive):\n    # Calculate posterior probability\n    pass`,
          sampleSolution: `def bayes_posterior(prior, true_pos, false_pos):\n    p_evidence = (true_pos * prior) + (false_pos * (1 - prior))\n    return (true_pos * prior) / p_evidence`
        },
        quiz: [
          {
            id: 'q-mod-bayes-1',
            question: 'When is a diagnostic test with 95% accuracy likely to produce more false alarms than true alarms?',
            options: [
              'When the condition is extremely rare in the general population (very low prior)',
              'When sample size is greater than 1,000,000',
              'When data is stored in SQL databases',
              'It is impossible for a 95% accurate test to produce false alarms'
            ],
            correctIndex: 0,
            explanation: 'When a condition is rare (e.g. 1 in 10,000), false positives from the healthy 9,999 dwarf the single true positive.',
            adaptiveTip: 'Always account for the base rate before assessing test accuracy.'
          }
        ],
        resources: [
          {
            title: 'Khan Academy Probability Course',
            type: 'interactive',
            url: 'https://www.khanacademy.org/math/statistics-probability',
            durationOrPages: '20 mins'
          }
        ]
      },
      {
        id: 'mod-sql-window-fresh',
        title: 'SQL Window Functions & Pipeline Extraction',
        phaseNumber: 1,
        phaseTitle: 'Phase 1: Mathematical, Statistical & Python Foundations',
        estimatedMinutes: 30,
        skillTarget: skills[1]?.name || 'SQL & Data Warehousing',
        difficulty: 'Beginner',
        status: 'locked',
        objectives: [
          'Calculate running totals and moving averages using OVER (PARTITION BY ... ORDER BY ...)',
          'Compute day-over-day changes using LAG() and LEAD()',
          'Rank rows within categories using ROW_NUMBER() and DENSE_RANK()'
        ],
        summary: 'Learn window functions to perform sophisticated analytical queries without collapsing individual rows.',
        contentMarkdown: `### Window Functions
Window functions calculate aggregate values across a set of rows related to the current row without grouping rows together.`,
        keyTakeaways: [
          'Window functions retain individual row granularity',
          'LAG and LEAD allow easy access to prior or subsequent row values'
        ],
        practicalExercise: {
          title: 'Calculate Running Total',
          prompt: 'Write a SQL query using SUM() OVER (ORDER BY date) to compute running revenue.',
          starterCode: `SELECT date, revenue, SUM(revenue) OVER (...) as running_rev FROM sales;`,
          sampleSolution: `SELECT date, revenue, SUM(revenue) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as running_rev FROM sales;`
        },
        quiz: [],
        resources: []
      }
    ];
  }

  public initializeNewUser(profile: UserProfile): {
    skills: Skill[];
    modules: LearningModule[];
    roadmap: CareerRoadmap;
  } {
    const careerTitle = profile.targetCareerTitle || 'Data Scientist';
    const careerId = profile.targetCareerId || 'career-data-scientist';
    const experienceLevel = profile.experienceLevel || 'beginner';

    const skills = this.getBaselineSkillsForCareer(careerTitle, experienceLevel);
    const roadmap = this.generateTailoredRoadmap(careerTitle, careerId, skills);
    const modules = this.generateTailoredModules(careerTitle, careerId, skills);

    this.userSkills.set(profile.id, skills);
    this.careerRoadmaps.set(profile.id, roadmap);
    this.learningModules.set(profile.id, modules);
    this.savedResources.set(profile.id, new Set());

    // Initialize fresh personalized AI chat welcome
    this.chatHistories.set(profile.id, [
      {
        id: `ai-welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Hello ${profile.name}! Welcome to EduSage. I am your AI Adaptive Tutor. I see your goal is to become a ${careerTitle}. How can I assist your learning journey today?`,
        language: 'en',
        timestamp: new Date().toISOString(),
        suggestedFollowups: [
          `What are the core skills for ${careerTitle}?`,
          'Explain my learning roadmap',
          'Where should I begin my first lesson?'
        ]
      }
    ]);

    return { skills, modules, roadmap };
  }
}

export const dataStore = new AppDataStore();
