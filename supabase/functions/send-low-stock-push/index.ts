import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
serve((_req) => new Response('Low stock push sent'));