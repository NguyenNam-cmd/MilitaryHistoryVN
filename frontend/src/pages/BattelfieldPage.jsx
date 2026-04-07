"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BattleMapsDisplay } from "../components/BattleMapsDisplay";
import {
  getAllBattlefields,
  getBattlefieldById,
} from "../services/battlefieldAPI";

export default function Battlefield() {
  const [battleData, setBattleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBattlefieldById(2);
        setBattleData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const getEmbedUrl = (url) => {
    if (!url) return "";

    const videoId =
      url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1];

    return `https://www.youtube.com/embed/${videoId}`;
  };
  const transformMaps = (images = []) => {
    return images.map((img, index) => ({
      id: img.id || index,
      thumbnail: img.image_url,
      full: img.image_url,
      title: `Phase ${index + 1}`,
      caption: "Battle map",
    }));
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setPlay(entry.isIntersecting);
      },
      { threshold: 0.6 },
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full bg-black text-white py-20 space-y-20">
      {/* 🎥 VIDEO */}
      <div ref={videoRef} className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Video tư liệu trận đánh
        </h2>

        <div className="aspect-video">
          {battleData && (
            <iframe
              className="w-full h-full rounded-xl"
              src={`${getEmbedUrl(battleData.youtube_url)}?autoplay=1&mute=0&controls=1`}
              title="Battle Video"
              allow="autoplay; encrypted-media"
            />
          )}
        </div>
      </div>

      {/* 🗺️ BATTLE MAPS */}
      <BattleMapsDisplay battleMaps={transformMaps(battleData?.images)} />
    </div>
  );
}
