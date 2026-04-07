import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./BattleMapsDisplay.css";

export default function BattleMapsDisplay({ battleMaps = [] }) {
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const imageContainerRef = useRef(null);
  const mainImageRef = useRef(null);

  const selectedMap = battleMaps.find((map) => map.id === selectedId);

  // Zoom bằng scroll
  useEffect(() => {
    const handleWheel = (e) => {
      if (!imageContainerRef.current?.contains(e.target)) return;

      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;

      setZoom((prev) => {
        const newZoom = prev + delta;
        return Math.min(Math.max(newZoom, 1), 3);
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Drag pan
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1) return;

    const newPan = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };

    const maxPan = 100;
    setPan({
      x: Math.max(-maxPan, Math.min(maxPan, newPan.x)),
      y: Math.max(-maxPan, Math.min(maxPan, newPan.y)),
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Controls
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 1));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleSelectMap = (id) => {
    setSelectedId(id);
    handleResetZoom();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      imageContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!battleMaps || battleMaps.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        Không có dữ liệu bản đồ
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Battle Maps
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN */}
          <div className="lg:col-span-2">
            <div
              ref={imageContainerRef}
              className="relative bg-white rounded-xl shadow-lg overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="relative w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                    }}
                  >
                    <img
                      ref={mainImageRef}
                      src={selectedMap?.full}
                      alt={selectedMap?.title}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Caption */}
              {selectedMap && (
                <div className="p-4 border-t">
                  <h3 className="font-bold">{selectedMap.title}</h3>
                  <p className="text-sm text-gray-600">{selectedMap.caption}</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-2 mt-4 justify-center">
              <button onClick={handleZoomIn}>+</button>
              <button onClick={handleZoomOut}>-</button>
              <button onClick={handleResetZoom}>Reset</button>
              <button onClick={toggleFullscreen}>Fullscreen</button>
            </div>
          </div>

          {/* THUMBNAILS */}
          <div>
            <div className="grid grid-cols-2 gap-3">
              {battleMaps.map((map) => (
                <button
                  key={map.id}
                  onClick={() => handleSelectMap(map.id)}
                  className={`border ${
                    selectedId === map.id ? "border-blue-500" : ""
                  }`}
                >
                  <img src={map.thumbnail} alt={map.title} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
