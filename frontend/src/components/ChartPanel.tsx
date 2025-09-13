import React from "react";

interface ChartPanelProps {
  chartImage: string;
}

const ChartPanel: React.FC<ChartPanelProps> = ({ chartImage }) => {
  const imgSrc = chartImage
    ? (chartImage.startsWith('data:image') ? chartImage : `data:image/png;base64,${chartImage}`)
    : '';

  const handleDownload = () => {
    if (!imgSrc) return;
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = 'chart.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    if (!imgSrc) return;
    try {
      const data = await fetch(imgSrc);
      const blob = await data.blob();
      await navigator.clipboard.write([
        new window.ClipboardItem({ [blob.type]: blob })
      ]);
      alert('Chart image copied to clipboard!');
    } catch (err) {
      alert('Failed to copy image.');
    }
  };

  return (
    <div className="chart-panel">
      <h2 style={{ color: "#2a4d7a" }}>Chart Output</h2>
      {imgSrc ? (
        <>
          <img
            src={imgSrc}
            alt="Chart"
            style={{
              maxWidth: "90%",
              maxHeight: "60vh",
              borderRadius: 12,
              boxShadow: "0 2px 12px rgba(0,40,120,0.07)",
            }}
          />
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <button onClick={handleDownload}>Download</button>
            <button onClick={handleCopy}>Copy</button>
          </div>
        </>
      ) : (
        <div style={{ color: "#2a4d7a", opacity: 0.7, marginTop: 32 }}>
          No chart generated yet.
        </div>
      )}
    </div>
  );
};

export default ChartPanel;