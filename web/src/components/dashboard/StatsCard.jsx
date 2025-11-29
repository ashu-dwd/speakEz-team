import React from "react";

/**
 * StatsCard - Displays a single metric/stat with icon
 */
const StatsCard = ({ icon: Icon, label, value, color = "primary", trend }) => {
  return (
    <div className="card bg-base-100 shadow-lg border border-base-300/50 hover:shadow-xl transition-shadow duration-200">
      <div className="card-body p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-base-content/60 mb-1">{label}</p>
            <h3 className="text-3xl font-bold text-base-content">{value}</h3>
            {trend && (
              <p className={`text-sm mt-2 ${trend.positive ? 'text-success' : 'text-error'}`}>
                {trend.positive ? '↑' : '↓'} {trend.value}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-${color}/10`}>
            <Icon className={`text-2xl text-${color}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
