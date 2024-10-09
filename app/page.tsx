"use client";

import { faSquareCheck, faSquareXmark, faPeopleGroup, faPerson, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistance } from "date-fns";
import { useEffect, useState } from "react";
import spinner from "./giphy.webp";
import Image from "next/image";

export default function Home() {
  const [chuteStatus, setChuteStatus] = useState<string>("");
  const [chuteUpdated, setChuteUpdated] = useState<string>("");

  const [gymStatus, setGymStatus] = useState<string>("");
  const [gymUpdated, setGymUpdated] = useState<string>("");

  const localAsyncGetStatus = async () => {
    const fetchedStatus = await fetch("/server");
    const response = await fetchedStatus.json();

    setChuteStatus(response.chuteStatus);
    setChuteUpdated(response.chuteUpdated);

    setGymStatus(response.gymStatus);
    setGymUpdated(response.gymUpdated);
  };

  useEffect(() => {
    localAsyncGetStatus();
  }, []);

  let relativeChuteDate = "";
  if (chuteUpdated) {
    relativeChuteDate = formatDistance(chuteUpdated, new Date().toString(), { addSuffix: true });
  }

  let relativeGymDate = "";
  if (gymUpdated) {
    relativeGymDate = formatDistance(gymUpdated, new Date().toString(), { addSuffix: true });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div id="title">Chute Status</div>
      {chuteStatus == "" ? (
        <Image id="spinner" width={60} src={spinner} alt="spinner"></Image>
      ) : (
        <>
          <div id="status-wrapper">
            <FontAwesomeIcon id="status-icon" style={{ color: chuteStatus === "CLEAR" ? "green" : "red" }} icon={chuteStatus === "CLEAR" ? faSquareCheck : faSquareXmark} />
            <div>
              <div id="status-title">{chuteStatus}</div>
              <div id="last-updated">{`${relativeChuteDate}`}</div>
            </div>
          </div>
          <div id="button-area">
            <button
              onClick={() => {
                fetch("/server", { method: "POST", body: "CLEAR" });
                setChuteStatus("CLEAR");
                setChuteUpdated(new Date().toString());
              }}
            >
              CLEAR
            </button>
            <button
              onClick={() => {
                fetch("/server", { method: "POST", body: "BLOCKED" });
                setChuteStatus("BLOCKED");
                setChuteUpdated(new Date().toString());
              }}
            >
              BLOCKED
            </button>
          </div>
        </>
      )}

      <div id="title">Gym Status</div>
      {gymStatus == "" ? (
        <Image id="spinner" width={60} src={spinner} alt="spinner"></Image>
      ) : (
        <>
          <div id="status-wrapper">
            <FontAwesomeIcon id="status-icon" style={{ color: gymStatus === "QUIET" ? "green" : "red" }} icon={gymStatus === "QUIET" ? faPerson : faPeopleGroup} />
            <div>
              <div id="status-title">{gymStatus}</div>
              <div id="last-updated">{relativeGymDate}</div>
            </div>
          </div>
          {gymStatus === "BUSY" && (
            <div
              style={{
                margin: "2vh auto 0 auto",
                display: "flex",
                alignItems: "center",
                color: "white",
                width: "fit-content",
                textAlign: "center",
                background: "#0064bd",
                borderRadius: "15px",
                padding: "8px 8px",
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: "25px", marginRight: "10px" }} />
              <div>
                Reverts to <b>Quiet</b> after one hour
              </div>
            </div>
          )}
          <div id="button-area">
            <button
              onClick={() => {
                fetch("/server", { method: "POST", body: "QUIET" });
                setGymStatus("QUIET");
                setGymUpdated(new Date().toString());
              }}
            >
              QUIET
            </button>
            <button
              onClick={() => {
                fetch("/server", { method: "POST", body: "BUSY" });
                setGymStatus("BUSY");
                setGymUpdated(new Date().toString());
              }}
            >
              BUSY
            </button>
          </div>
        </>
      )}
    </div>
  );
}
