"use client";

import { useEffect, useRef } from "react";
import styles from "@/styles/boardingpass.module.css";

interface BoardingPassProps {
  passenger: string;
  flight: string;
  gate: number;
  seat: string;
  role: string;
  company: string;
  atsScore: number;
  revealed: boolean;
}

function generateBarcode(svg: SVGSVGElement) {
  svg.innerHTML = "";
  const pattern = [3,1,2,1,3,2,1,3,1,2,1,1,3,2,1,3,1,1,2,3,1,2,1,3,1,2,3,1,1,2,1,3,2,1];
  const total = pattern.reduce((a, b) => a + b, 0);
  const scale = 220 / total;
  let x = 0;
  pattern.forEach((units, i) => {
    if (i % 2 === 0) {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(x));
      rect.setAttribute("y", "0");
      rect.setAttribute("width", String(units * scale - 0.5));
      rect.setAttribute("height", "44");
      rect.setAttribute("fill", "#000000");
      svg.appendChild(rect);
    }
    x += units * scale;
  });
}

export default function BoardingPass({
  passenger, flight, gate, seat, role, company, atsScore, revealed,
}: BoardingPassProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current) generateBarcode(barcodeRef.current);
  }, []);

  const date = new Date().toLocaleDateString("en-US", {
    day: "2-digit", month: "short", year: "numeric",
  }).toUpperCase();

  let statusClass = styles.statusPriority;
  let statusText = "PRIORITY";
  if (atsScore < 85 && atsScore >= 70) { statusClass = styles.statusStandard; statusText = "STANDARD"; }
  else if (atsScore < 70) { statusClass = styles.statusStandby; statusText = "STANDBY"; }

  const barcodeId = `RWY-${new Date().getFullYear()}-${passenger.split(" ")[1]?.slice(0,5).toUpperCase()}-${gate}`;

  return (
    <div
      className={styles.card}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Airline strip */}
      <div className={styles.airlineStrip}>
        <span>RUNWAY AIRLINES — BOARDING PASS</span>
        <span className={styles.airlineLogo}>✈</span>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {/* Left panel */}
        <div className={styles.left}>
          <div className={styles.field}>
            <span className={styles.label}>Passenger Name</span>
            <span className={styles.valueLarge}>{passenger}</span>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <span className={styles.label}>From</span>
              <span className={styles.value}>CAREER LAUNCH</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>To</span>
              <span className={styles.value}>{company}</span>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <span className={styles.label}>Flight No.</span>
              <span className={styles.value}>{flight}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Date</span>
              <span className={styles.value}>{date}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Class</span>
              <span className={styles.value}>BUSINESS</span>
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Role / Destination</span>
            <span className={styles.value}>{role}</span>
          </div>
        </div>

        {/* Perforation */}
        <div className={styles.perforation}>
          <div className={styles.perforationLine} />
        </div>

        {/* Right stub */}
        <div className={styles.right}>
          <div className={styles.field}>
            <span className={styles.label}>Gate</span>
            <span className={styles.valueHuge}>{gate}</span>
            <span className={styles.unit}>ATS Score</span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Seat</span>
            <span className={styles.valueSeat}>{seat}</span>
            <span className={styles.unit}>Match</span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Boarding</span>
            <span className={`${styles.valueStatus} ${statusClass}`}>{statusText}</span>
          </div>
        </div>
      </div>

      {/* Barcode strip */}
      <div className={styles.barcodeStrip}>
        <svg
          ref={barcodeRef}
          className={styles.barcode}
          viewBox="0 0 220 44"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Boarding pass barcode"
        />
        <span className={styles.barcodeText}>{barcodeId}</span>
      </div>
    </div>
  );
}
