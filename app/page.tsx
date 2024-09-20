"use client";

import { faSquareCheck, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function Home() {
  const [localStatus, setLocalStatus] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const localAsyncGetStatus = async () => {
    const fetchedStatus = await fetch("/server");
    const response = await fetchedStatus.json();
    setLocalStatus(response.status);
    setLastUpdated(response.lastUpdated);
  };

  useEffect(() => {
    localAsyncGetStatus();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div id="title">Cortland Yard Chute Status</div>
      {localStatus != "" && (
        <>
          <FontAwesomeIcon id="status-icon" style={{ color: localStatus === "CLEAR" ? "green" : "red" }} icon={localStatus === "CLEAR" ? faSquareCheck : faSquareXmark} />
          <div id="status-title">{localStatus}</div>
          <div id="last-updated">{`Updated: ${lastUpdated}`}</div>
        </>
      )}
      <div id="button-area">
        <button
          onClick={() => {
            fetch("/server", { method: "POST", body: "CLEAR" });
            setLocalStatus("CLEAR");
            setLastUpdated(new Date().toLocaleString());
          }}
        >
          CLEAR
        </button>
        <button
          onClick={() => {
            fetch("/server", { method: "POST", body: "BLOCKED" });
            setLocalStatus("BLOCKED");
            setLastUpdated(new Date().toLocaleString());
          }}
        >
          BLOCKED
        </button>
      </div>
    </div>
  );
}
