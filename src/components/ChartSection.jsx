import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement,
    Filler
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement,
    Filler
);

export default function ChartSection({ data }) {
    if (!data) return null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#000',
                titleFont: { family: 'Outfit', size: 12, weight: 'bold' },
                bodyFont: { family: 'Outfit', size: 12 },
                padding: 12,
                cornerRadius: 12,
                displayColors: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.03)', drawBorder: false },
                ticks: { font: { family: 'Outfit', size: 10, weight: 'bold' }, color: 'rgba(0,0,0,0.3)' }
            },
            x: {
                grid: { display: false },
                ticks: { font: { family: 'Outfit', size: 10, weight: 'bold' }, color: 'rgba(0,0,0,0.3)' }
            }
        }
    };

    const performanceData = {
        labels: ['Flowrate', 'Pressure', 'Temperature'],
        datasets: [
            {
                data: [data.averages.flowrate, data.averages.pressure, data.averages.temperature],
                backgroundColor: [
                    '#10b981', // flowrate
                    '#f59e0b', // pressure
                    '#ef4444'  // temperature
                ],
                borderRadius: 12,
                barThickness: 40,
            },
        ],
    };

    const pieData = {
        labels: Object.keys(data.type_distribution),
        datasets: [
            {
                data: Object.values(data.type_distribution),
                backgroundColor: [
                    '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'
                ],
                borderWidth: 0,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: { family: 'Outfit', size: 10, weight: 'bold' },
                    padding: 20,
                    usePointStyle: true,
                }
            },
            tooltip: {
                backgroundColor: '#000',
                titleFont: { family: 'Outfit', size: 12, weight: 'bold' },
                bodyFont: { family: 'Outfit', size: 12 },
                padding: 12,
                cornerRadius: 12,
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="glass-card rounded-[2rem] p-8 h-[450px] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold">Average Metrics</h3>
                    <span className="text-[10px] font-black text-black/30 uppercase tracking-widest">Global Averages</span>
                </div>
                <div className="flex-1">
                    <Bar options={chartOptions} data={performanceData} />
                </div>
            </div>

            <div className="glass-card rounded-[2rem] p-8 h-[450px] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold">Distribution</h3>
                    <span className="text-[10px] font-black text-black/30 uppercase tracking-widest">Equipment Types</span>
                </div>
                <div className="flex-1">
                    <Pie options={pieOptions} data={pieData} />
                </div>
            </div>
        </div>
    );
}
