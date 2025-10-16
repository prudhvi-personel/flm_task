import { useState, useEffect, useMemo } from "react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import CompanyCard from "./components/CompanyCard";
import Filter from "./components/Filter";
import Loading from "./components/Loading";
import companiesData from "./data/companies.json";
import "./App.css";

function formatNumber(num) {
  if (typeof num !== "number") return num;
  return num.toLocaleString();
}

function formatRevenue(revenue) {
  if (typeof revenue !== "number") return revenue;
  if (revenue >= 1_000_000_000) return `$${(revenue / 1_000_000_000).toFixed(1)}B`;
  if (revenue >= 1_000_000) return `$${(revenue / 1_000_000).toFixed(1)}M`;
  if (revenue >= 1_000) return `$${(revenue / 1_000).toFixed(1)}K`;
  return `$${revenue}`;
}

function App() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", location: "", industry: "" });
  const [view, setView] = useState("grid"); // 'grid' | 'table'

  // New: sorting state
  const [sortBy, setSortBy] = useState("name"); // name | employees | revenue | founded
  const [sortDir, setSortDir] = useState("asc"); // asc | desc

  useEffect(() => {
    // simulate API call
    setTimeout(() => {
      setCompanies(companiesData);
      setLoading(false);
    }, 800);
  }, []);

  // Filter + Sort
  const filteredCompanies = useMemo(() => {
    const filtered = companies.filter((company) => {
      return (
        company.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        company.location.toLowerCase().includes(filters.location.toLowerCase()) &&
        company.industry.toLowerCase().includes(filters.industry.toLowerCase())
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      let av, bv;
      switch (sortBy) {
        case "employees":
          av = Number(a.employees) || 0;
          bv = Number(b.employees) || 0;
          break;
        case "revenue":
          av = Number(a.revenue) || 0;
          bv = Number(b.revenue) || 0;
          break;
        case "founded":
          av = Number(a.founded) || 0;
          bv = Number(b.founded) || 0;
          break;
        case "name":
        default:
          av = (a.name || "").toLowerCase();
          bv = (b.name || "").toLowerCase();
      }

      if (typeof av === "string" && typeof bv === "string") {
        const cmp = av.localeCompare(bv);
        return sortDir === "asc" ? cmp : -cmp;
      } else {
        const cmp = av - bv;
        return sortDir === "asc" ? cmp : -cmp;
      }
    });

    return sorted;
  }, [companies, filters, sortBy, sortDir]);

  // helper to toggle direction
  const toggleSortDir = () => setSortDir((d) => (d === "asc" ? "desc" : "asc"));

  return (
    <div className="min-h-screen bg-gray-800">
      {/* Dashboard Header */}
      <header className="border-b border-gray-700 bg-gray-800/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-teal-500 via-teal-400 to-cyan-400 shadow">
              <HiOutlineBuildingOffice2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-100">Company Directory</h1>
          </div>
          <p className="text-gray-400 text-left">Discover innovative companies shaping the future</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <Filter filters={filters} setFilters={setFilters} companies={companies} />
          </div>

          {/* View Toggle + Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300 mr-2">View:</span>
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  view === "grid"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-700/80"
                }`}
                aria-pressed={view === "grid"}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setView("table")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  view === "table"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-700/80"
                }`}
                aria-pressed={view === "table"}
              >
                Table
              </button>
            </div>

            {/* Sort controls */}
            <div className="flex items-center gap-2 bg-gray-800">
              <label className="text-sm text-gray-300">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 text-gray-100 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="name">Name (A–Z)</option>
                <option value="employees">Employees</option>
                <option value="revenue">Revenue</option>
                <option value="founded">Founded</option>
              </select>

              <button
                type="button"
                onClick={toggleSortDir}
                className="px-2 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-700/80 text-sm"
                aria-label="Toggle sort direction"
                title={sortDir === "asc" ? "Ascending" : "Descending"}
              >
                {sortDir === "asc" ? "▲" : "▼"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <Loading />
          ) : filteredCompanies.length === 0 ? (
            <p className="text-center text-gray-500 mt-6">No companies found.</p>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          ) : (
            // Table view
            <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-lg">
              <table className="min-w-full divide-y divide-gray-700 table-fixed">
                <colgroup>
                  <col className="w-2/5" />
                  <col className="w-1/6" />
                  <col className="w-1/6" />
                  <col className="w-1/12" />
                  <col className="w-1/12" />
                  <col className="w-1/12" />
                  <col className="w-1/12" />
                </colgroup>

                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Industry</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Location</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400">Employees</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400">Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Founded</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredCompanies.map((c) => (
                    <tr key={c.id} className="group hover:bg-gray-800/50">
                      <td className="px-4 py-3 whitespace-nowrap max-w-[250px]">
                        <div className="text-sm font-semibold text-white truncate text-left">{c.name}</div>
                        <div className="text-xs text-gray-400 truncate text-left">{c.description}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{c.industry}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{c.location}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-100">
                        {formatNumber(c.employees)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-100">
                        {formatRevenue(c.revenue)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{c.founded}</td>

                      <td className="px-4 py-3 whitespace-nowrap text-center overflow-visible">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-1.5 px-3 rounded transform translate-x-6 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 ease-out"
                        >
                          <span role="img" aria-hidden>
                            ✨
                          </span>
                          Get AI Insight
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
