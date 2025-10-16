import {
  HiOutlineBriefcase,
  HiOutlineLocationMarker,
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";
import { twMerge } from "tailwind-merge";

// Utility to format numbers with commas
function formatNumber(num) {
  if (typeof num !== "number") return num;
  return num.toLocaleString();
}

// Utility to format revenue as $K, $M, $B
function formatRevenue(revenue) {
  if (typeof revenue !== "number") return revenue;
  if (revenue >= 1_000_000_000)
    return `$${(revenue / 1_000_000_000).toFixed(1)}B`;
  if (revenue >= 1_000_000)
    return `$${(revenue / 1_000_000).toFixed(1)}M`;
  if (revenue >= 1_000)
    return `$${(revenue / 1_000).toFixed(1)}K`;
  return `$${revenue}`;
}

export default function CompanyCard({ company }) {
  return (
    <div
      className={twMerge(
        // added `group` so child elements can react to card hover
        "group flex flex-col bg-gray-800 border border-gray-700 rounded-xl p-6 min-h-[340px] transition-shadow duration-300 shadow",
        "hover:border-transparent hover:shadow-[0_8px_30px_rgba(45,212,191,0.25)]"
      )}
    >
      {/* Top Section */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          {/* Optional: Company logo or icon could go here */}
          <div className="flex-1 min-w-0">
            {/* default white, transitions to teal on hover */}
            <div className="text-xl font-extrabold text-white truncate transition-colors duration-200 group-hover:text-teal-400">
              {company.name}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <HiOutlineBriefcase className="text-teal-500 text-base" />
              <span className="text-gray-300 text-sm">{company.industry}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <HiOutlineLocationMarker className="text-gray-400 text-base" />
              <span className="text-gray-400 text-sm">{company.location}</span>
            </div>
          </div>
        </div>
        {company.description && (
          <div className="text-gray-400 text-sm mt-2 mb-4 line-clamp-3">
            {company.description}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="mt-auto">
        <div className="border-t border-gray-700 mb-3 mt-2" />
        <div className="grid grid-cols-2 gap-4 mb-2">
          {/* Employees */}
          <div className="flex items-center gap-2">
            <HiOutlineUsers className="text-lime-400 text-lg" />
            <div>
              <div className="text-gray-100 font-semibold text-base">
                {formatNumber(company.employees)}
              </div>
              <div className="text-xs text-gray-400">Employees</div>
            </div>
          </div>
          {/* Revenue */}
          <div className="flex items-center gap-2">
            <HiOutlineCurrencyDollar className="text-green-400 text-lg" />
            <div>
              <div className="text-gray-100 font-semibold text-base">
                {formatRevenue(company.revenue)}
              </div>
              <div className="text-xs text-gray-400">Revenue</div>
            </div>
          </div>
        </div>
        {/* Founded Year */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
          <HiOutlineCalendar className="text-gray-500 text-sm" />
          <span>Founded {company.founded}</span>
        </div>
        {/* AI Insight Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 transition-colors duration-200 text-white font-bold py-2 rounded-lg text-sm mt-auto"
        >
          <span role="img" aria-label="sparkle" className="text-base">✨</span>
          Get AI Insight
        </button>
      </div>
    </div>
  );
}
