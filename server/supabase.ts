import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * Lazy initialization of Supabase Client.
 * Handles missing configuration gracefully so app doesn't crash on startup.
 */
export function getSupabase(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  if (!supabaseClient) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      console.log('✅ Supabase Client initialized successfully.');
    } catch (err) {
      console.warn('⚠️ Supabase client initialization error:', err);
      return null;
    }
  }

  return supabaseClient;
}

/**
 * Check if Supabase connection is configured and active.
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL) &&
    (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY)
  );
}

/**
 * Save user profile to Supabase 'users' table
 */
export async function saveUserToSupabase(user: any): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        name: user.name,
        email: user.email,
        target_career_id: user.targetCareerId,
        target_career_title: user.targetCareerTitle,
        education_level: user.educationLevel,
        current_step: user.currentStep || 'dashboard',
        data: user,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase save user warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to save user to Supabase:', err);
    return false;
  }
}

/**
 * Fetch user profile from Supabase
 */
export async function getUserFromSupabase(userIdOrEmail: string): Promise<any | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`id.eq.${userIdOrEmail},email.eq.${userIdOrEmail}`)
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    // Return the full structured user JSON if stored, or reconstructed
    if (data.data) {
      return data.data;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      targetCareerId: data.target_career_id,
      targetCareerTitle: data.target_career_title,
      educationLevel: data.education_level,
    };
  } catch (err) {
    console.warn('Error fetching user from Supabase:', err);
    return null;
  }
}

/**
 * Save user assessments / quiz attempts to Supabase
 */
export async function saveAssessmentToSupabase(userId: string, assessmentResult: any): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('assessments')
      .insert({
        user_id: userId,
        career_id: assessmentResult.careerId,
        overall_score: assessmentResult.overallScore,
        skill_scores: assessmentResult.skillScores,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('Supabase assessment save error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to save assessment to Supabase:', err);
    return false;
  }
}
