import React, { useEffect, useState } from "react";
import { getLogs } from "../services/api";
import LogTable from "../components/LogTable";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getLogs().then(res => setLogs(res.data.logs));
  }, []);

  return (
    <div className="p-6">
      <LogTable logs={logs}/>
    </div>
  );
}
