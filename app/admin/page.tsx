'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { getBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { LoginForm } from '@/components/admin/login-form';
import { PostList } from '@/components/admin/post-list';
import { LeadList } from '@/components/admin/lead-list';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * The dashboard is a client-only app that talks to Supabase directly.
 *
 * There is no middleware guarding this route, and that is deliberate: hiding the
 * page would be security theatre. Every read and write is gated by row-level
 * policies pinned to a single user id, so an uninvited visitor who loads this
 * page gets a login form and nothing else.
 */
export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = getBrowserClient();
    if (!supabase) {
      setChecking(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md space-y-2 rounded-xl border border-border bg-card p-6 text-center">
          <h1 className="text-lg font-semibold">Dashboard not configured</h1>
          <p className="text-sm text-muted-foreground">
            Set <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then
            redeploy. The public site keeps working on its built-in posts until
            then.
          </p>
        </div>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) return <LoginForm />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => getBrowserClient()?.auth.signOut()}
        >
          <LogOut className="mr-1.5 h-4 w-4" />
          Sign out
        </Button>
      </header>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          <PostList />
        </TabsContent>
        <TabsContent value="leads" className="mt-6">
          <LeadList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
