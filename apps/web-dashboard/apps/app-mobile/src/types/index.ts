export type Prescription = {
  id: string;
  user_id: string;
  name: string;
  category: "medication" | "supply";
  dosage?: string | null;
  frequency?: string | null;
  remaining_quantity: number;
  created_at?: string;
};
