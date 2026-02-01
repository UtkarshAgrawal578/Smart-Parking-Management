export default function LiveCountCard({
  title,
  value,
  variant = "blue",
}) {
  const variants = {
    blue: "from-blue-500 to-indigo-500",
    green: "from-green-500 to-emerald-500",
    red: "from-red-500 to-rose-500",
    yellow: "from-yellow-500 to-orange-500",
  };

  return (
    <div className="relative group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      
      {/* Accent bar */}
      <div
        className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${variants[variant]}`}
      />

      {/* Glow */}
      <div
        className={`absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition duration-300 bg-gradient-to-r ${variants[variant]}`}
      />

      {/* Content */}
      <div className="relative pl-4">
        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
          {title}
        </p>
        <p className="text-4xl font-extrabold text-gray-900 mt-2">
          {value}
        </p>
      </div>
    </div>
  );
}
