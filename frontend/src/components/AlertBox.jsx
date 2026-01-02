export default function AlertBox({ show }) {
  if (!show) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
      Parking Full — No free slots!
    </div>
  );
}
