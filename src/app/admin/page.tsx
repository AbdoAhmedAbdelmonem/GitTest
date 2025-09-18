import { Metadata } from 'next';
import TokenStatusMonitor from '@/components/TokenStatusMonitor';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Token Management',
  description: 'Monitor and manage Google Drive API tokens',
};

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage system components including Google Drive API tokens.
          </p>
        </div>

        <div className="grid gap-6">
          <TokenStatusMonitor />
        </div>
      </div>
    </div>
  );
}