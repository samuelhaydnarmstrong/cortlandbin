"use client";

import { faSquareCheck, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistance } from "date-fns";
import { useEffect, useState } from "react";
import * as spinner from "./giphy.webp";
import Image from "next/image";

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

  let relativeDate = "";
  if (lastUpdated) {
    relativeDate = formatDistance(lastUpdated, new Date().toLocaleString(), { addSuffix: true });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div id="title">Cortland Yard Chute Status</div>
      {localStatus == "" ? (
        <Image style={{ marginTop: "15vh" }} width={100} src={spinner} alt="spinner"></Image>
      ) : (
        <>
          <FontAwesomeIcon id="status-icon" style={{ color: localStatus === "CLEAR" ? "green" : "red" }} icon={localStatus === "CLEAR" ? faSquareCheck : faSquareXmark} />
          <div id="status-title">{localStatus}</div>
          <div id="last-updated">{`Updated: ${relativeDate}`}</div>
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
