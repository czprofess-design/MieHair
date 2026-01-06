
import React, { useMemo, useState } from 'react';
import { TimeEntry } from '../types';
import { useSettings } from '../context/SettingsContext';

interface MonthlyChartProps {
  entries: TimeEntry[];
  range: { start: Date; end: Date };
}

const calculateHours = (startISO: string, endISO: string | null): number => {
    if (!endISO) return 0;
    const startDate = new Date(startISO);
    const endDate = new Date(endISO);
    const durationMs = endDate.getTime() - startDate.getTime();
    return durationMs > 0 ? durationMs / (1000 * 60 * 60) : 0;
};

const MonthlyChart: React.FC<MonthlyChartProps> = ({ entries, range }) => {
  const { t, language } = useSettings();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const chartData = useMemo(() => {
    const data = [];
    const curr = new Date(range.start);
    const end = new Date(range.end);
    const ymdFormatter = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' });

    while (curr < end) {
        const dStr = ymdFormatter.format(curr);
        const dayEntries = entries.filter(e => ymdFormatter.format(new Date(e.start_time)) === dStr);
        
        data.push({
            label: curr.getDate() + '/' + (curr.getMonth() + 1),
            day: curr.getDate(),
            hours: dayEntries.reduce((sum, e) => sum + calculateHours(e.start_time, e.end_time), 0),
            revenue: dayEntries.reduce((sum, e) => sum + (e.revenue || 0), 0)
        });
        curr.setDate(curr.getDate() + 1);
    }
    return data;
  }, [entries, range]);

  const maxHours = Math.max(8, ...chartData.map(d => d.hours));
  const maxRevenue = Math.max(1000000, ...chartData.map(d => d.revenue));

  // SVG dimensions
  const width = 1000;
  const height = 220; 
  const paddingLeft = 50;
  const paddingRight = 60;
  const paddingTop = 20;
  const paddingBottom = 30;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getPoints = (type: 'hours' | 'revenue') => {
    return chartData.map((d, i) => {
      const x = paddingLeft + (i / (Math.max(1, chartData.length - 1))) * chartWidth;
      const val = type === 'hours' ? d.hours : d.revenue;
      const max = type === 'hours' ? maxHours : maxRevenue;
      const y = height - paddingBottom - (val / (max || 1)) * chartHeight;
      return { x, y, val, label: d.label };
    });
  };

  const hourPoints = getPoints('hours');
  const revenuePoints = getPoints('revenue');

  const createPath = (points: {x: number, y: number}[]) => 
    `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  const createAreaPath = (points: {x: number, y: number}[]) => {
    const baseLine = height - paddingBottom;
    return `${createPath(points)} L ${points[points.length-1].x},${baseLine} L ${points[0].x},${baseLine} Z`;
  };

  return (
    <div className="bg-[#0f172a]/40 dark:bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-white/5 p-5 shadow-xl overflow-hidden animate-fadeIn">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <h3 className="text-white/90 font-bold text-sm flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-sky-400 to-indigo-600 rounded-full"></div>
                Biểu Đồ Hiệu Suất
            </h3>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-0.5 bg-sky-500"></div>
                    <span className="text-[10px] font-bold text-gray-400">Giờ Làm (h)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-0.5 bg-emerald-500"></div>
                    <span className="text-[10px] font-bold text-gray-400">Doanh Thu (₫)</span>
                </div>
            </div>
        </div>

        <div className="relative w-full overflow-visible">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible font-sans">
                <defs>
                    <linearGradient id="gradHour" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {[0, 0.25, 0.5, 0.75, 1].map(v => (
                    <g key={`grid-${v}`}>
                        <line 
                            x1={paddingLeft} y1={paddingTop + (1-v) * chartHeight}
                            x2={width - paddingRight} y2={paddingTop + (1-v) * chartHeight}
                            stroke="rgba(255,255,255,0.03)"
                            strokeWidth="1"
                        />
                        <text 
                            x={paddingLeft - 8} y={paddingTop + (1-v) * chartHeight + 4} 
                            textAnchor="end" className="fill-gray-600 text-[9px] font-bold"
                        >
                            {(v * maxHours).toFixed(0)}h
                        </text>
                        <text 
                            x={width - paddingRight + 8} y={paddingTop + (1-v) * chartHeight + 4} 
                            textAnchor="start" className="fill-emerald-600/60 text-[9px] font-bold"
                        >
                            {Math.round((v * maxRevenue) / 1000)}k
                        </text>
                    </g>
                ))}

                <path d={createAreaPath(hourPoints)} fill="url(#gradHour)" />
                <path d={createAreaPath(revenuePoints)} fill="url(#gradRev)" />

                <path 
                    d={createPath(hourPoints)} 
                    fill="none" stroke="#0ea5e9" strokeWidth="1.5" 
                    strokeLinecap="round" strokeLinejoin="round"
                />
                <path 
                    d={createPath(revenuePoints)} 
                    fill="none" stroke="#10b981" strokeWidth="1.5" 
                    strokeLinecap="round" strokeLinejoin="round"
                />

                {chartData.map((d, i) => {
                    const hp = hourPoints[i];
                    const rp = revenuePoints[i];
                    const isActive = hoverIdx === i;
                    const step = chartWidth / (chartData.length || 1);

                    return (
                        <g key={i}>
                            {(d.hours > 0 || isActive) && <circle cx={hp.x} cy={hp.y} r={isActive ? 4 : 2} fill="#0ea5e9" />}
                            {(d.revenue > 0 || isActive) && <circle cx={rp.x} cy={rp.y} r={isActive ? 4 : 2} fill="#10b981" />}
                            
                            <rect 
                                x={hp.x - step/2} y={paddingTop} width={step} height={chartHeight}
                                fill="transparent" className="cursor-crosshair"
                                onMouseEnter={() => setHoverIdx(i)}
                                onMouseLeave={() => setHoverIdx(null)}
                            />

                            {(chartData.length <= 15 || i % Math.ceil(chartData.length/10) === 0) && (
                                <text 
                                    x={hp.x} y={height - 10} 
                                    textAnchor="middle" 
                                    className="fill-gray-500 text-[9px] font-bold"
                                >
                                    {d.label}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>

            {hoverIdx !== null && (
                <div 
                    className="absolute pointer-events-none bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-2xl z-50 animate-fadeIn backdrop-blur-md"
                    style={{ 
                        left: `${Math.min(90, Math.max(10, (hoverIdx / (chartData.length - 1)) * 100))}%`,
                        top: '10px',
                        transform: 'translateX(-50%)'
                    }}
                >
                    <p className="text-[10px] font-bold text-gray-400 mb-1.5 border-b border-slate-700 pb-1">Ngày {chartData[hoverIdx].label}</p>
                    <div className="space-y-1 min-w-[100px]">
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-[10px] text-sky-400 font-bold">Giờ Làm:</span>
                            <span className="text-[10px] text-white font-bold">{chartData[hoverIdx].hours.toFixed(1)}h</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-[10px] text-emerald-400 font-bold">Doanh Thu:</span>
                            <span className="text-[10px] text-white font-bold">{t.currencySymbol}{chartData[hoverIdx].revenue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default MonthlyChart;
