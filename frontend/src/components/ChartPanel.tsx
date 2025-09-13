import React from "react";

interface ChartPanelProps {
  chartImage: string;
}

const ChartPanel: React.FC<ChartPanelProps> = ({ chartImage }) => (
  <div className="chart-panel">
    <h2 style={{ color: "#2a4d7a" }}>Chart Output</h2>
    {chartImage ? (
      <img
        src={chartImage.startsWith('data:image') ? chartImage : `data:image/png;base64,${chartImage}`}
        alt="Chart"
        style={{
          maxWidth: "90%",
          maxHeight: "60vh",
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,40,120,0.07)",
        }}
      />
    ) : (
      <div style={{ color: "#2a4d7a", opacity: 0.7, marginTop: 32 }}>
        No chart generated yet.
      </div>
    )}
  </div>
);

export default ChartPanel;