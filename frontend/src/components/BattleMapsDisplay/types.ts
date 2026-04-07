/**
 * TypeScript Type Definitions for BattleMapsDisplay Component
 *
 * If your project uses TypeScript, import these types:
 * import { BattleMap, BattleMapsDisplayProps } from "@/components/BattleMapsDisplay/types";
 */

/**
 * Represents a single battle map/diagram
 */
export interface BattleMap {
  /** Unique identifier for the map (required) */
  id: number;

  /** URL to the thumbnail image (recommended size: 120x120px) */
  thumbnail: string;

  /** URL to the full-size image (recommended size: 1200x800px or larger) */
  full: string;

  /** Display title for the map (e.g., "Battle of Dien Bien Phu - Phase 1") */
  title: string;

  /** Detailed description or caption text (shown below the main image) */
  caption: string;

  /** Optional: Additional metadata */
  metadata?: {
    date?: string;
    location?: string;
    commander?: string;
    forces?: string;
    [key: string]: any;
  };
}

/**
 * Props for the BattleMapsDisplay component
 */
export interface BattleMapsDisplayProps {
  /**
   * Array of battle map objects to display
   * If not provided, the component will use built-in placeholder maps
   * @default Built-in placeholder maps
   */
  battleMaps?: BattleMap[];

  /**
   * Optional: Callback when a map is selected
   * @param mapId - The ID of the selected map
   */
  onMapSelect?: (mapId: number) => void;

  /**
   * Optional: Callback when zoom level changes
   * @param zoomLevel - The current zoom level (1-3)
   */
  onZoomChange?: (zoomLevel: number) => void;

  /**
   * Optional: CSS class name for custom styling
   */
  className?: string;

  /**
   * Optional: Custom title for the gallery
   * @default "Battle Maps & Diagrams"
   */
  title?: string;

  /**
   * Optional: Custom subtitle
   * @default "Explore tactical formations and military strategies"
   */
  subtitle?: string;

  /**
   * Optional: Maximum zoom level allowed
   * @default 3
   */
  maxZoom?: number;

  /**
   * Optional: Minimum zoom level allowed
   * @default 1
   */
  minZoom?: number;

  /**
   * Optional: Zoom increment (per scroll or button click)
   * @default 0.2
   */
  zoomStep?: number;

  /**
   * Optional: Enable/disable fullscreen feature
   * @default true
   */
  enableFullscreen?: boolean;

  /**
   * Optional: Enable/disable keyboard shortcuts
   * @default true
   */
  enableKeyboardShortcuts?: boolean;

  /**
   * Optional: Enable/disable drag to pan
   * @default true
   */
  enableDragToPan?: boolean;

  /**
   * Optional: Auto-select first map on mount
   * @default true
   */
  autoSelectFirst?: boolean;
}

/**
 * Internal state for zoom and pan
 */
export interface ZoomPanState {
  zoom: number;
  pan: {
    x: number;
    y: number;
  };
}

/**
 * Mouse event for dragging
 */
export interface DragState {
  isDragging: boolean;
  dragStart: {
    x: number;
    y: number;
  };
}

/**
 * Component configuration options
 */
export interface BattleMapsConfig {
  zoom: {
    min: number;
    max: number;
    step: number;
    initial: number;
  };
  animation: {
    fadeDuration: number;
    scaleOnHover: number;
  };
  images: {
    thumbnailSize: string;
    fullSize: string;
  };
}

/**
 * Keyboard shortcuts mapping
 */
export interface KeyboardShortcuts {
  zoomIn: string[];
  zoomOut: string[];
  reset: string[];
  fullscreen: string[];
  exit: string[];
}

// Example usage in your component:
//
// import { FC } from 'react';
// import { BattleMap, BattleMapsDisplayProps } from '@/components/BattleMapsDisplay/types';
//
// const MyBattleComponent: FC = () => {
//   const maps: BattleMap[] = [
//     {
//       id: 1,
//       thumbnail: '/maps/thumb1.jpg',
//       full: '/maps/full1.jpg',
//       title: 'Battle Phase 1',
//       caption: 'Initial deployment',
//       metadata: {
//         date: '1954-03-13',
//         location: 'Dien Bien Phu, Vietnam',
//       }
//     }
//   ];
//
//   const props: BattleMapsDisplayProps = {
//     battleMaps: maps,
//     onMapSelect: (id) => console.log('Selected map:', id),
//     maxZoom: 4,
//   };
//
//   return <BattleMapsDisplay {...props} />;
// };
