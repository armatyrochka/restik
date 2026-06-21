'use client';

export default function MenuSearch({ value, onChange }) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Пошук страв..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full md:w-64 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-red-600"
      />
      <svg
        className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
}