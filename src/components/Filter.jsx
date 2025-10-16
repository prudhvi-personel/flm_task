import React, { useState, useEffect } from "react";
import { HiOutlineSearch, HiOutlineX, HiOutlineChevronDown } from "react-icons/hi";

export default function Filter({ filters, setFilters, companies = [] }) {
  const [local, setLocal] = useState(filters);

  // keep local in sync if parent resets filters
  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  // debounce updates to parent to avoid heavy re-renders while typing
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters(local);
    }, 300);
    return () => clearTimeout(t);
  }, [local, setFilters]);

  // derive options from companies if provided
  const locations = Array.from(
    new Set(
      (companies || [])
        .map((c) => (c.location ? c.location : ""))
        .filter(Boolean)
    )
  ).sort();
  const industries = Array.from(
    new Set(
      (companies || [])
        .map((c) => (c.industry ? c.industry : ""))
        .filter(Boolean)
    )
  ).sort();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload on Enter
  };

  // clear only the search term (name)
  const clearSearch = () => {
    setLocal((s) => ({ ...s, name: "" }));
    setFilters((prev) => ({ ...prev, name: "" })); // immediate clear upstream
  };

  // clear specific dropdowns
  const clearLocation = () => {
    setLocal((s) => ({ ...s, location: "" }));
    setFilters((prev) => ({ ...prev, location: "" }));
  };
  const clearIndustry = () => {
    setLocal((s) => ({ ...s, industry: "" }));
    setFilters((prev) => ({ ...prev, industry: "" }));
  };

  // clear all filters
  const clearAll = () => {
    const empty = { name: "", location: "", industry: "" };
    setLocal(empty);
    setFilters(empty); // immediate clear upstream
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 border border-gray-700 shadow-lg rounded-xl p-6 mb-8 md:mb-0"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-100">Filter &amp; Search</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-gray-300 bg-gray-700 hover:bg-gray-700/80 px-3 py-1 rounded-md transition"
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="border-b border-gray-700 mt-4" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {/* Search (spans 2 cols on md+) */}
        <div className="relative md:col-span-2">
          <label htmlFor="name" className="sr-only">
            Search by Company Name
          </label>

          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <HiOutlineSearch className="w-5 h-5" />
          </span>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Search by Company Name..."
            value={local.name}
            onChange={handleChange}
            className="w-full bg-gray-700 placeholder-gray-400 text-gray-100 rounded-md py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Search by company name"
          />

          {/* inline clear button for search term */}
          {local.name ? (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200 focus:outline-none"
              aria-label="Clear search"
            >
              <HiOutlineX className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Location Dropdown with clear + chevron */}
        <div className="relative">
          <label htmlFor="location" className="sr-only">
            Location
          </label>

          <select
            id="location"
            name="location"
            value={local.location}
            onChange={handleChange}
            className="w-full bg-gray-700 text-gray-100 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
            aria-label="Filter by location"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* chevron icon (decorative) */}
          <span className="absolute inset-y-0 right-2 flex items-center text-gray-400 pointer-events-none">
            <HiOutlineChevronDown className="w-4 h-4" />
          </span>

          {/* clear button for location */}
          {local.location ? (
            <button
              type="button"
              onClick={clearLocation}
              className="absolute inset-y-0 right-8 flex items-center pr-1 text-gray-400 hover:text-gray-200 focus:outline-none"
              aria-label="Clear location filter"
            >
              <HiOutlineX className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Industry Dropdown with clear + chevron */}
        <div className="relative">
          <label htmlFor="industry" className="sr-only">
            Industry
          </label>

          <select
            id="industry"
            name="industry"
            value={local.industry}
            onChange={handleChange}
            className="w-full bg-gray-700 text-gray-100 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
            aria-label="Filter by industry"
          >
            <option value="">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>

          <span className="absolute inset-y-0 right-2 flex items-center text-gray-400 pointer-events-none">
            <HiOutlineChevronDown className="w-4 h-4" />
          </span>

          {local.industry ? (
            <button
              type="button"
              onClick={clearIndustry}
              className="absolute inset-y-0 right-8 flex items-center pr-1 text-gray-400 hover:text-gray-200 focus:outline-none"
              aria-label="Clear industry filter"
            >
              <HiOutlineX className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
