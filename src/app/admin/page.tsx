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

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Cron Job Setup Instructions</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>1.</strong> Go to <a href="https://cron-job.org" target="_blank" rel="noopener noreferrer" className="underline">cron-job.org</a></p>
            <p><strong>2.</strong> Create a new cron job with these settings:</p>
            <ul className="ml-4 mt-2 space-y-1">
              <li>• URL: <code className="bg-blue-100 px-1 rounded">https://your-app.vercel.app/api/cron/token-refresh</code></li>
              <li>• Method: GET or POST</li>
              <li>• Schedule: Every 30 minutes</li>
              <li>• Headers: <code className="bg-blue-100 px-1 rounded">x-cron-secret: your-secret-key-here</code></li>
            </ul>
            <p><strong>3.</strong> Replace the URL with your actual Vercel domain</p>
            <p><strong>4.</strong> Use the same secret key as your CRON_SECRET environment variable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
