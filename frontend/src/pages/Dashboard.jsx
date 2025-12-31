import React, { useEffect, useState } from "react";
import { getLiveCount } from "../services/api";
import LiveCountCard from "../components/LiveCountCard";
import AlertBox from "../components/AlertBox";

export default function Dashboard() {
  const [count, setCount] = useState(0);
  const capacity = 50; // fixed for hackathon

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveCount().then(res => {
        setCount(res.data.count);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <LiveCountCard count={count} capacity={capacity} />
      <AlertBox show={count > capacity} />
    </div>
  );
}
