'use client';

import { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getBrowserClient();
    if (!supabase) {
      toast.error('Supabase is not configured.');
      return;
    }

    setPending(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);

    if (error) {
      // Supabase returns the same message for wrong password and unknown user,
      // which is the correct behaviour — don't reveal which accounts exist.
      toast.error(error.message);
      return;
    }
    // The session change is picked up by the listener in app/admin/page.tsx.
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold">Admin sign in</h1>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
        </Button>
      </form>
    </div>
  );
}
