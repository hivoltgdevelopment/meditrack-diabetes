import "dotenv/config";

export default {
    expo: {
        name: "MediTrack Diabetes",
        slug: "meditrack-diabetes",
        version: "1.0.0",
        extra: {
            supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
            supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
            edgeUrl: process.env.EXPO_PUBLIC_EDGE_URL,
            resendApiKey: process.env.EXPO_PUBLIC_RESEND_API_KEY,
        },
    },
};
