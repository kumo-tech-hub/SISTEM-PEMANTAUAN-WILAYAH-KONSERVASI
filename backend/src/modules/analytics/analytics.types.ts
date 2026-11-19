export interface DashboardSummary {
  updatedAt: string;
  metrics: Array<{
    label: string;
    value: string;
    unit?: string;
    emphasis?: boolean;
  }>;
  monthlyTrend: Array<{
    month: string;
    count: number;
  }>;
  severityComposition: Array<{
    level: string;
    count: number;
    color: string;
  }>;
}

