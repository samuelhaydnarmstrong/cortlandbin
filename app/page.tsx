"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [localStatus, setLocalStatus] = useState<string>("");

  const localAsyncGetStatus = async () => {
    const fetchedStatus = await fetch("/server");
    const response = await fetchedStatus.json();
    setLocalStatus(response.status);
  };

  useEffect(() => {
    localAsyncGetStatus();
  }, []);

  return (
    <div>
      {localStatus != undefined && <p>{`The chute is currently ${localStatus}`}</p>}

      <button
        onClick={() => {
          fetch("/server", { method: "POST", body: "BLOCKED" });
          setLocalStatus("BLOCKED");
        }}
      >
        Blocked
      </button>
      <button
        onClick={() => {
          fetch("/server", { method: "POST", body: "UNBLOCKED" });
          setLocalStatus("UNBLOCKED");
        }}
      >
        Unblocked
      </button>
    </div>
  );
}
