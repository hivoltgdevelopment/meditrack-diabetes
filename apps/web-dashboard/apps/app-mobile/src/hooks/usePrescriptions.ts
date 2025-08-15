import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import type { Prescription } from "../types";

export function usePrescriptions() {
  const [data, setData] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes?.user?.id;
    if (!userId) {
      setData([]);
      setLoading(false);
      return;
    }
    const { data: rows, error: err } = await supabase
      .from("prescriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    setData(rows ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel("rx-changes")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "prescriptions" },
        () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return { data, loading, error, reload: load };
}
