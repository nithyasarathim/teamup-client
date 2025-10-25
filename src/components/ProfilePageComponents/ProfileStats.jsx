// src/pages/ProfilePage/components/ProfileStats.jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ListChecks } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProfileStats = ({ tasks }) => {
  const totalTasks = tasks.completed + tasks.overdue + tasks.inProgress + tasks.todo;
  const addressedTasks = tasks.completed + tasks.inProgress;
  const addressedRate = totalTasks > 0 ? Math.round((addressedTasks / totalTasks) * 100) : 0;

  const chartData = {
    labels: ['Completed', 'Overdue', 'In Progress', 'To Do'],
    datasets: [
      {
        data: [tasks.completed, tasks.overdue, tasks.inProgress, tasks.todo],
        backgroundColor: ['#A7F3D0', '#FECACA', '#BFDBFE', '#FEF08A'],
        borderColor: ['#10B981', '#EF4444', '#3B82F6', '#F59E0B'],
        borderWidth: 1,
        borderRadius: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 20,
          font: { size: 12 },
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = Math.round((value / totalTasks) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 h-full">
      <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
        <ListChecks className="text-blue-500" size={18} />
        Task Statistics
      </h3>
      
      <div className="relative h-64">
        <Doughnut 
          data={chartData}
          options={chartOptions}
        />
        <div className="absolute inset-0 mt-16 items-center justify-center pointer-events-none">
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-700">{addressedRate}%</span>
            <p className="text-xs text-gray-500 mt-1">Tasks <br/>Addressed</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center space-y-2">
        <div className="flex flex-wrap justify-center gap-2 text-gray-700">
          <span>
            <span className="font-medium">{tasks.inProgress}</span> in progress,
          </span>
          <span>
            <span className="font-medium">{tasks.todo}</span> to do,
          </span>
          <span>
            <span className="font-medium text-green-600">{tasks.completed}</span> completed &
          </span>
          <span>
            <span className="font-medium text-red-600">{tasks.overdue}</span> overdue tasks
          </span>
        </div>
        <p className="text-gray-500 m-4">{totalTasks} total assigned tasks</p>
      </div>
    </div>
  );
};

export default ProfileStats;