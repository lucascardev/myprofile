"use client";
import React from 'react';
import { AsciiArt } from "@/components/ui/ascii-art";
 
export function AsciiArtMatrixDemo() {
  return (
    <AsciiArt
      src="https://assets.aceternity.com/avatars/manu.webp"
      resolution={80}
      color="#00ff00"
      animationStyle="matrix"
      inverted
      animateOnView={false}
      className="mx-auto aspect-square w-full max-w-lg bg-black"
    />
  );
}
