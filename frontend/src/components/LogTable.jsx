import React from "react";

export default function LogTable({ logs }) {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">Parking Logs</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Timestamp</th>
            <th className="p-2">Count</th>
            <th className="p-2">Hash</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx} className="border-b">
              <td className="p-2">{log.timestamp}</td>
              <td className="p-2">{log.count}</td>
              <td className="p-2">{log.hash.slice(0, 12)}...</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
