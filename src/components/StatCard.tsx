interface StatCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: string;
}

export default function StatCard({ title, value, unit, icon }: StatCardProps) {
  return (
    <div className="bg-gray-900 dark:bg-gray-800 dark:border-gray-700 border border-gray-800 rounded-xl p-5 flex items-start gap-4 transition-colors duration-200">
      <div className="text-2xl mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">{title}</p>
        <p className="text-2xl font-bold text-white dark:text-gray-100 mt-1 transition-colors duration-200">
          {value}
          <span className="text-sm font-normal text-gray-400 dark:text-gray-400 ml-1 transition-colors duration-200">{unit}</span>
        </p>
      </div>
    </div>
  );
}
