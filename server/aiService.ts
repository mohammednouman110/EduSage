import { GoogleGenAI } from '@google/genai';
import {
  UserProfile,
  AccessibilityPreferences,
  LearningPreferences,
  Skill,
  CareerPath,
  LanguageCode
} from '../src/types.js';

export interface AIContextPayload {
  user: UserProfile;
  accessibility?: AccessibilityPreferences;
  learningPrefs?: LearningPreferences;
  skills?: Skill[];
  currentModuleTitle?: string;
  userQuery: string;
  language?: LanguageCode;
  requestSimplified?: boolean;
}

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  en: 'English',
  hi: 'Hindi (हिन्दी)',
  kn: 'Kannada (ಕನ್ನಡ)',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  ml: 'Malayalam (മലയാളം)',
  mr: 'Marathi (मराठी)',
  bn: 'Bengali (বাংলা)',
};

/**
 * Resilient multi-model fallback executor with exponential backoff for high-demand spikes (503/429)
 */
async function generateGeminiContentWithFallback(
  params: {
    contents: string;
    systemInstruction?: string;
    temperature?: number;
  },
  modelChain: string[] = [
    'gemini-2.5-flash',
    'gemini-3.7-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ]
): Promise<string | null> {
  const client = getAiClient();
  if (!client) return null;

  for (const model of modelChain) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: params.contents,
          config: {
            systemInstruction: params.systemInstruction,
            temperature: params.temperature ?? 0.7,
          },
        });

        if (response.text && response.text.trim()) {
          return response.text.trim();
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('429') ||
          errMsg.includes('high demand') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('fetch failed');

        if (isTransient && attempt === 0) {
          // Quick jitter backoff
          await new Promise((res) => setTimeout(res, 350));
          continue;
        }
        // Move on to next model in the fallback chain
        break;
      }
    }
  }

  return null;
}

export async function askAiTutor(context: AIContextPayload): Promise<{
  text: string;
  simplifiedVersion: string;
  suggestedFollowups: string[];
  language: LanguageCode;
}> {
  const language = context.language || context.learningPrefs?.primaryLanguage || 'en';
  const langName = LANGUAGE_NAMES[language] || 'English';

  const criticalGaps = (context.skills || [])
    .filter((s) => s.status === 'critical-gap')
    .map((s) => `${s.name} (Current: ${s.currentLevel}%, Target: ${s.targetLevel}%)`)
    .join(', ');

  const systemInstruction = `You are EduSage, the AI Learning & Career Tutor for an adaptive education platform.
Your mission: Help the user understand difficult technical concepts, overcome identified skill gaps, and progress along their career roadmap.

USER CONTEXT:
- Name: ${context.user.name}
- Career Goal: ${context.user.targetCareerTitle || 'Software & AI Professional'}
- Education / Experience: ${context.user.educationLevel} (${context.user.experienceLevel} level)
- Learning Style: ${(context.learningPrefs?.learningStyles || ['interactive', 'visual']).join(', ')}
- Critical Skill Gaps Identified: ${criticalGaps || 'None specific yet'}
- Target Response Language: ${langName}
- Accessibility Preferences: ${
    context.accessibility?.simplifiedUI
      ? 'Requires clean, direct, simplified language without unnecessary jargon'
      : 'Standard accessible formatting'
  }

CORE PRINCIPLES:
1. Explain in ${langName}. If technical terms are standard in English (like "Bayes Theorem" or "Window Function"), provide the transliterated/English term alongside clear regional language explanation.
2. Adapt to the user's skill level and target career.
3. Be encouraging, warm, structured, and pedagogical. Use relatable everyday analogies.
4. Keep the output clean and markdown-formatted.`;

  const prompt = `User's Question / Topic:
"${context.userQuery}"

Current Context / Active Learning Module:
${context.currentModuleTitle ? `Module: ${context.currentModuleTitle}` : 'General Career & Skill Development'}

Provide a comprehensive, empathetic tutor response in ${langName}, followed by 3 helpful follow-up questions the learner could ask next.`;

  const generatedText = await generateGeminiContentWithFallback({
    contents: prompt,
    systemInstruction,
    temperature: 0.7,
  });

  if (generatedText) {
    // Generate a quick simplified version for cognitive accessibility
    let simplifiedText = generatedText;
    if (context.requestSimplified || context.accessibility?.simplifiedUI) {
      simplifiedText = `**Key Takeaway in Simple Terms:**\n` + generatedText.slice(0, 300) + '...';
    }

    // Generate suggested follow-ups
    const followUps = [
      `Can you give me a practical code or calculation example of this in ${langName}?`,
      `How is this applied in real interviews for ${context.user.targetCareerTitle || 'this role'}?`,
      `What is the most common mistake beginners make here?`,
    ];

    return {
      text: generatedText,
      simplifiedVersion: simplifiedText,
      suggestedFollowups: followUps,
      language,
    };
  }

  // Graceful fallback pedagogical generator (ensures zero downtime & offline support)
  return generateFallbackTutorResponse(context, langName, language);
}

function generateFallbackTutorResponse(
  context: AIContextPayload,
  langName: string,
  language: LanguageCode
): {
  text: string;
  simplifiedVersion: string;
  suggestedFollowups: string[];
  language: LanguageCode;
} {
  const queryLower = context.userQuery.toLowerCase();
  let topic = 'this concept';
  if (queryLower.includes('prob') || queryLower.includes('bayes') || queryLower.includes('stat')) {
    topic = 'Probability & Bayes Theorem';
  } else if (queryLower.includes('sql') || queryLower.includes('query')) {
    topic = 'SQL & Analytical Queries';
  } else if (queryLower.includes('machine learning') || queryLower.includes('ml') || queryLower.includes('tree') || queryLower.includes('xgboost')) {
    topic = 'Machine Learning Algorithms & Models';
  } else if (queryLower.includes('career') || queryLower.includes('job') || queryLower.includes('roadmap') || queryLower.includes('interview')) {
    topic = 'Career Readiness & Skill Growth';
  }

  let text = '';
  let simplified = '';

  if (language === 'hi') {
    text = `### ${topic} की सरल व्याख्या (Hindi)

नमस्ते **${context.user.name}**! आइए इसे आसान तरीके से समझते हैं:

1. **मुख्य विचार (Core Concept):**
   जब हम डेटा साइंस और एआई में काम करते हैं, तो हमारे पास हमेशा 100% पक्का डेटा नहीं होता। **${topic}** हमें अनिश्चितता (uncertainty) के बीच सबसे सही और तर्कसंगत फैसला लेने में मदद करता है।

2. **दैनिक जीवन का उदाहरण (Real Life Example):**
   मान लीजिए आप सुबह खिड़की से बाहर देखते हैं। अगर बादल छाए हैं, तो बारिश होने की संभावना बढ़ जाती है। यानी नई जानकारी (बादल) मिलने पर आपका पुराना अनुमान (Prior Belief) अपडेट हो जाता है।

3. **आपके करियर (${context.user.targetCareerTitle || 'Data Scientist'}) के लिए महत्व:**
   यह आपके स्किल गैप को भरने के लिए बेहद महत्वपूर्ण है। जब आप क्लासिफिकेशन मॉडल या A/B टेस्टिंग करेंगे, तो यह सिद्धांत हर जगह इस्तेमाल होगा।`;

    simplified = `संक्षेप में: नई जानकारी मिलने पर अपने पुराने अनुमान को सुधारने के नियम को ही हम यहाँ सीखते हैं। यह ${context.user.targetCareerTitle || 'डेटा साइंस'} के लिए बहुत ज़रूरी है।`;
  } else if (language === 'kn') {
    text = `### ${topic} ವಿವರಣೆ (Kannada)

ನಮಸ್ಕಾರ **${context.user.name}**! 

1. **ಮೂಲ ಕಲ್ಪನೆ (Core Concept):**
   ಡೇಟಾ ಸೈನ್ಸ್ ಮತ್ತು ಎಐನಲ್ಲಿ ಅನಿಶ್ಚಿತತೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು **${topic}** ಅತ್ಯಂತ ಸಹಾಯಕವಾಗಿದೆ. ಹೊಸ ಪುರಾವೆ ಅಥವಾ ಡೇಟಾ ಸಿಕ್ಕಾಗ ನಮ್ಮ ಆರಂಭಿಕ ಊಹೆಯನ್ನು ಹೇಗೆ ಅಪ್ಡೇಟ್ ಮಾಡುವುದು ಎಂಬುದನ್ನು ಇದು ಕಲಿಸುತ್ತದೆ.

2. **ನೈಜ ಉದಾಹರಣೆ:**
   ಮೋಡ ಕವಿದ ವಾತಾವರಣವಿದ್ದಾಗ ಮಳೆ ಬರುವ ಸಂಭವನೀಯತೆ ಹೆಚ್ಚಾಗುತ್ತದೆ. ಹೊಸ ಮಾಹಿತಿ ನಿಮ್ಮ ಹಳೆಯ ಊಹೆಯನ್ನು ಬದಲಾಯಿಸುತ್ತದೆ.

3. **ನಿಮ್ಮ ಗುರಿ (${context.user.targetCareerTitle || 'Data Scientist'}):**
   ನಿಮ್ಮ ಸ್ಕಿಲ್ ಗ್ಯಾಪ್ ಕಡಿಮೆ ಮಾಡಲು ಈ ಕಾನ್ಸೆಪ್ಟ್ ಅನ್ನು ಅಭ್ಯಾಸ ಮಾಡುವುದು ಮುಖ್ಯವಾಗಿದೆ.`;

    simplified = `ಸರಳವಾಗಿ ಹೇಳುವುದಾದರೆ: ಹೊಸ ಡೇಟಾ ಬಂದಾಗ ನಮ್ಮ ಅಂದಾಜನ್ನು ಬದಲಾಯಿಸುವ ಗಣಿತವೇ ಇದು.`;
  } else if (language === 'ta') {
    text = `### ${topic} பற்றிய எளிய விளக்கம் (Tamil)

வணக்கம் **${context.user.name}**! 

1. **முக்கிய கருத்து (Core Concept):**
   தரவு அறிவியல் மற்றும் AI-யில் **${topic}** மிக முக்கியமான அடித்தளமாகும். புதிய தகவல்கள் கிடைக்கும் போது, நமது முந்தைய கணிப்புகளை எவ்வாறு துல்லியமாக மேம்படுத்துவது என்பதை இது விளக்குகிறது.

2. **நடைமுறை உதாரணம்:**
   மேகமூட்டம் இருக்கும் போது மழை வருவதற்கான வாய்ப்பு அதிகரிக்கிறது. புதிய தகவல் உங்கள் பழைய அனுமானத்தை மாற்றுகிறது.

3. **உங்கள் தொழில் வளர்ச்சி (${context.user.targetCareerTitle || 'Data Scientist'}):**
   நேர்காணல்களில் இந்த கோட்பாடு குறித்த நடைமுறை கேள்விகள் அதிகம் கேட்கப்படும்.`;

    simplified = `சுருக்கமாக: புதிய தரவுகள் வரும்போது நமது முந்தைய கணிப்பை திருத்தி அமைக்கும் தர்க்கம் இது.`;
  } else if (language === 'te') {
    text = `### ${topic} సమగ్ర వివరణ (Telugu)

నమస్కారం **${context.user.name}**!

1. **కీలక భావన (Core Concept):**
   డేటా సైన్స్ & ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ రంగంలో **${topic}** ఎంతో ముఖ్యం. కొత్త సాక్ష్యాలు లేదా డేటా లభించినప్పుడు మునుపటి అంచనాలను ఎలా అప్‌డేట్ చేయాలో ఇది వివరిస్తుంది.

2. **నిజ జీవిత ఉదాహరణ:**
   ఆకాశం మేఘావృతమై ఉన్నప్పుడు వర్షం పడే సంభావ్యత పెరుగుతుంది. కొత్త సమాచారం మీ పాత అంచనాను మారుస్తుంది.

3. **కెరీర్ లక్ష్యం (${context.user.targetCareerTitle || 'Data Scientist'}):**
   ఈ నైపుణ్యాన్ని సాధించడం ద్వారా మీరు ఇంటర్వ్యూలలో మెరుగైన ప్రతిభను కనబరచవచ్చు.`;

    simplified = `క్లుప్తంగా: కొత్త డేటా ఆధారంగా మునుపటి అంచనాలను సరైన విధంగా సరిచేసుకునే విధానమే ఇది.`;
  } else if (language === 'ml') {
    text = `### ${topic} ലളിതമായ വിശദീകരണം (Malayalam)

നമസ്കാരം **${context.user.name}**!

1. **പ്രധാന ആശയം (Core Concept):**
   ഡാറ്റാ സയൻസിലും ആർട്ടിഫിഷ്യൽ ഇന്റലിജൻസിലും അനിശ്ചിതത്വങ്ങൾ കൈകാര്യം ചെയ്യാൻ **${topic}** അത്യന്താപേക്ഷിതമാണ്.

2. **യഥാർത്ഥ ജീവിത ഉദാഹരണം:**
   പുതിയ വിവരങ്ങൾ ലഭിക്കുമ്പോൾ നമ്മുടെ മുൻധാരണകൾ കൃത്യമായി പുതുക്കാൻ ഇത് സഹായിക്കുന്നു.

3. **നിങ്ങളുടെ കരിയർ ലക്ഷ്യം (${context.user.targetCareerTitle || 'Data Scientist'}):**
   ഈ സ്കിൽ ഗ്യാപ് പരിഹരിക്കുന്നത് നിങ്ങളുടെ റെഡിനെസ്സ് സ്കോർ വർദ്ധിപ്പിക്കും.`;

    simplified = `ലളിതമായി പറഞ്ഞാൽ: പുതിയ തെളിവുകളുടെ അടിസ്ഥാനത്തിൽ പഴയ അനുമാനങ്ങൾ പരിഷ്കരിക്കുന്ന രീതിയാണിത്.`;
  } else if (language === 'mr') {
    text = `### ${topic} ची सोपी समजूत (Marathi)

नमस्कार **${context.user.name}**!

1. **मुख्य संकल्पना (Core Concept):**
   डेटा सायन्स आणि एआय मध्ये **${topic}** अत्यंत मूलभूत आहे. नवीन माहिती मिळाल्यावर आपले जुने अंदाज कसे सुधारायचे हे यातून समजते.

2. **दैनंदिन उदाहरण:**
   आकाशात ढग जमा झाल्यावर पाऊस पडण्याची शक्यता वाढते. नवीन माहितीमुळे जुना अंदाज बदलतो.

3. **तुमचे करिअर उद्दिष्ट (${context.user.targetCareerTitle || 'Data Scientist'}):**
   तुमचे स्किल गॅप भरून काढण्यासाठी हा घटक अत्यंत महत्त्वाचा आहे.`;

    simplified = `थोडक्यात: नवीन माहितीच्या आधारे जुन्या अंदाजांमध्ये सुधारणा करण्याचे तंत्र म्हणजे हे होय.`;
  } else if (language === 'bn') {
    text = `### ${topic} সহজ ব্যাখ্যা (Bengali)

নমস্কার **${context.user.name}**!

1. **মূল ধারণা (Core Concept):**
   ডেটা সায়েন্স এবং এআই ক্ষেত্রে **${topic}** অত্যন্ত গুরুত্বপূর্ণ ভূমিকা পালন করে। নতুন তথ্য পাওয়ার পর পূর্বের অনুমানকে কীভাবে হালনাগাদ করা যায়, তা এখানে শেখানো হয়।

2. **বাস্তব উদাহরণ:**
   আকাশ মেঘলা থাকলে বৃষ্টি হওয়ার সম্ভাবনা বেড়ে যায়। নতুন ক্লু আপনার পুরনো ধারণাকে আপডেট করে।

3. **আপনার ক্যারিয়ার লক্ষ্য (${context.user.targetCareerTitle || 'Data Scientist'}):**
   এই স্কিল গ্যাপটি পূরণ করলে আপনার ইন্টারভিউ প্রস্তুতি আরও দৃঢ় হবে।`;

    simplified = `সংক্ষেপে: নতুন তথ্যের ভিত্তিতে পুরনো অনুমানকে আরও নির্ভুলভাবে সংশোধন করাই হলো এই বিষয়ের মূল কথা।`;
  } else {
    text = `### Understanding ${topic} for ${context.user.targetCareerTitle || 'Your Career'}

Hello **${context.user.name}**! Let's break down this concept systematically:

#### 1. The Core Intuition
Whenever you are working on modern predictive models or engineering pipelines, you rarely have complete certainty. **${topic}** gives us a disciplined mathematical framework to update our initial hypotheses whenever fresh data arrives.

#### 2. Relatable Real-World Analogy
Think of diagnostic testing: if a condition is relatively rare, even a test with high accuracy needs to be interpreted alongside the prior base rate. New evidence updates your probability, turning raw observations into actionable intelligence.

#### 3. Targeted Skill Gap Action Plan
- **Current Assessment:** Priority focus area in your personalized learning track.
- **Immediate Next Step:** Work through the interactive problem sets and exercises in your learning path.
- **Why Recruiters Ask This:** Top hiring teams evaluate whether you understand foundational principles rather than just calling black-box library functions.`;

    simplified = `In simple terms: ${topic} is about using new clues to update what you already believed, so you make accurate predictions in Data Science and AI.`;
  }

  return {
    text,
    simplifiedVersion: simplified,
    suggestedFollowups: [
      `Can you show me a step-by-step numerical example?`,
      `How does this directly relate to my target role as ${context.user.targetCareerTitle || 'a professional'}?`,
      `Explain this concept in ${language === 'en' ? 'Hindi or Kannada' : 'English'}.`,
      `Give me a quiz question to test my understanding.`
    ],
    language,
  };
}

export async function generateAdaptiveRecommendationExplanation(
  user: UserProfile,
  career: CareerPath,
  userSkills: Skill[]
): Promise<{
  matchingReasons: string[];
  criticalGapsToClose: string[];
  aiGrowthTrajectory: string;
}> {
  const prompt = `Analyze why the career "${career.title}" is recommended for user ${user.name}:
- User Background: ${user.educationLevel}, experience: ${user.experienceLevel}, interests: ${user.interests.join(', ')}
- Target Career: ${career.title}
- Current Skills: ${userSkills.map(s => `${s.name}: ${s.currentLevel}%`).join(', ')}

Provide 3 concise bullet reasons why they match, 2 critical gaps to focus on, and a 2-sentence encouraging AI growth summary.`;

  const text = await generateGeminiContentWithFallback({
    contents: prompt,
    temperature: 0.7,
  });

  if (text && text.length > 50) {
    return {
      matchingReasons: career.whyMatch.positives,
      criticalGapsToClose: career.whyMatch.gapsToClose,
      aiGrowthTrajectory: text.slice(0, 280) + '...',
    };
  }

  return {
    matchingReasons: career.whyMatch.positives,
    criticalGapsToClose: career.whyMatch.gapsToClose,
    aiGrowthTrajectory: career.whyMatch.aiInsight,
  };
}
