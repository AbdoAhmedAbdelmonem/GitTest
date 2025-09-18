'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { checkTokenStatus, triggerTokenRefresh, type TokenStatus, type RefreshResult } from '@/lib/token-utils';

export default function TokenStatusMonitor() {
  const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshResult, setLastRefreshResult] = useState<RefreshResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check token status on component mount
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const status = await checkTokenStatus();
      setTokenStatus(status);
    } catch (error) {
      console.error('Failed to check token status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await triggerTokenRefresh();
      setLastRefreshResult(result);

      // Re-check status after refresh
      await checkStatus();
    } catch (error) {
      console.error('Failed to refresh tokens:', error);
      setLastRefreshResult({
        success: false,
        message: 'Failed to refresh tokens',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusBadge = () => {
    if (isLoading) {
      return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Checking...</Badge>;
    }

    if (!tokenStatus) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Unknown</Badge>;
    }

    if (tokenStatus.isValid) {
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Valid</Badge>;
    } else {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Invalid</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Token Status Monitor
        </CardTitle>
        <CardDescription>
          Monitor and manage Google Drive API tokens for admin users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          {getStatusBadge()}
        </div>

        {tokenStatus?.lastChecked && (
          <div className="text-xs text-muted-foreground">
            Last checked: {tokenStatus.lastChecked.toLocaleString()}
          </div>
        )}

        {lastRefreshResult && (
          <div className={`p-3 rounded-md text-sm ${
            lastRefreshResult.success
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="font-medium">
              {lastRefreshResult.success ? '✅ Refresh Successful' : '❌ Refresh Failed'}
            </div>
            <div>{lastRefreshResult.message}</div>
            {lastRefreshResult.refreshedCount !== undefined && (
              <div className="mt-1">
                Refreshed: {lastRefreshResult.refreshedCount} |
                Failed: {lastRefreshResult.failedCount} |
                Total: {lastRefreshResult.totalUsers}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={checkStatus}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <Clock className="w-4 h-4 mr-2" />
            Check Status
          </Button>

          <Button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Tokens'}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Automatic refresh runs every 30 minutes via cron-job.org</span>
          </div>
          <p>• Manual refresh can be triggered anytime</p>
          <p>• All admin users' tokens are refreshed simultaneously</p>
          <p>• System runs 24/7 when site is active</p>
        </div>
      </CardContent>
    </Card>
  );
}
