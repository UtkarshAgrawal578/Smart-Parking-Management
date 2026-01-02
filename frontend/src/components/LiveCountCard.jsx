export default function LiveCountCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 uppercase tracking-wide">{title}</p>
        <p className="text-4xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}
