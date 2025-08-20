export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      insurance: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          policy_number: string;
          coverage_details: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          policy_number: string;
          coverage_details?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: string;
          policy_number?: string;
          coverage_details?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

export type Insurance = Database["public"]["Tables"]["insurance"]["Row"];
