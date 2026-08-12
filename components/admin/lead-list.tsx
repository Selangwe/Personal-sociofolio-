'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Download, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getBrowserClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Lead {
  id: string;
  form: 'contact' | 'newsletter' | 'resource-download';
  email: string;
  name: string | null;
  subject: string | null;
  message: string | null;
  resource: string | null;
  created_at: string;
}

const FORM_LABELS: Record<Lead['form'], string> = {
  contact: 'Contact',
  newsletter: 'Newsletter',
  'resource-download': 'Resource',
};

/** Escapes a value for CSV: quote it and double any inner quotes. */
function csvCell(value: string | null): string {
  return `"${(value ?? '').replace(/"/g, '""')}"`;
}

export function LeadList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Lead['form']>('all');

  const load = useCallback(async () => {
    const supabase = getBrowserClient();
    if (!supabase) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);

    if (error) {
      toast.error(`Could not load leads: ${error.message}`);
      return;
    }
    setLeads((data ?? []) as Lead[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () => (filter === 'all' ? leads : leads.filter((l) => l.form === filter)),
    [leads, filter],
  );

  const exportCsv = () => {
    if (visible.length === 0) {
      toast.error('Nothing to export.');
      return;
    }

    const header = ['Date', 'Form', 'Name', 'Email', 'Subject', 'Message', 'Resource'];
    const rows = visible.map((lead) =>
      [
        csvCell(format(new Date(lead.created_at), 'yyyy-MM-dd HH:mm')),
        csvCell(lead.form),
        csvCell(lead.name),
        csvCell(lead.email),
        csvCell(lead.subject),
        csvCell(lead.message),
        csvCell(lead.resource),
      ].join(','),
    );

    const blob = new Blob([[header.join(','), ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {loading
            ? 'Loading...'
            : `${visible.length} lead${visible.length === 1 ? '' : 's'}`}
        </p>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All forms</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
              <SelectItem value="resource-download">Resource</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={load} aria-label="Refresh leads">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="mr-1.5 h-4 w-4" />
            CSV
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Form</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="hidden md:table-cell">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}

            {!loading && visible.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No leads yet.
                </TableCell>
              </TableRow>
            )}

            {visible.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                  {format(new Date(lead.created_at), 'd MMM, HH:mm')}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{FORM_LABELS[lead.form]}</Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{lead.name || '—'}</div>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-xs text-primary hover:underline"
                  >
                    {lead.email}
                  </a>
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-sm">
                  {lead.subject && (
                    <div className="text-xs font-medium">{lead.subject}</div>
                  )}
                  {lead.message && (
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                      {lead.message}
                    </div>
                  )}
                  {lead.resource && (
                    <div className="text-xs text-muted-foreground">
                      Downloaded: {lead.resource}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
