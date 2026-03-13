import React, { useEffect, useState } from 'react';
import {
  loadSkinFromJsDelivr,
  getVideoSkinAttributes,
  resolveVideoClasses,
  getSkinStyleObject,
  type SkinDefinition,
} from '@page-speed/skins';

// Example 1: Simple video with skin attributes
export function SimpleVideoWithSkin() {
  const [skin, setSkin] = useState<SkinDefinition | null>(null);

  useEffect(() => {
    loadSkinFromJsDelivr('0.1.0', 'skins/video/base.json').then(setSkin);
  }, []);

  if (!skin) return <div>Loading skin...</div>;

  const attrs = getVideoSkinAttributes(skin);

  return (
    <video
      {...attrs}
      src="video.mp4"
      controls
    />
  );
}

// Example 2: Video with custom controls wrapper
export function VideoWithCustomControls() {
  const [skin, setSkin] = useState<SkinDefinition | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadSkinFromJsDelivr('0.1.0', 'skins/video/linear-inspired.json').then(setSkin);
  }, []);

  if (!skin) return null;

  const classes = resolveVideoClasses(skin);
  const style = getSkinStyleObject(skin);

  return (
    <div className={classes.container} style={style}>
      <video
        className={classes.video}
        src="video.mp4"
        onClick={() => setIsPlaying(!isPlaying)}
      />

      <div className={classes.controlsBar}>
        <button
          className={classes.playButton}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <div className={classes.timeline}>
          <div className={classes.timelineProgress} style={{ width: '30%' }} />
        </div>

        <span className={classes.timeText}>1:23 / 4:56</span>

        <button className={classes.fullscreenButton}>⛶</button>
      </div>
    </div>
  );
}

// Example 3: Skin switcher
export function VideoWithSkinSwitcher() {
  const [currentSkin, setCurrentSkin] = useState<'base' | 'linear-inspired' | 'minimal-hover'>('base');
  const [skin, setSkin] = useState<SkinDefinition | null>(null);

  useEffect(() => {
    loadSkinFromJsDelivr('0.1.0', `skins/video/${currentSkin}.json`).then(setSkin);
  }, [currentSkin]);

  if (!skin) return null;

  const attrs = getVideoSkinAttributes(skin);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setCurrentSkin('base')}>Base</button>
        <button onClick={() => setCurrentSkin('linear-inspired')}>Linear</button>
        <button onClick={() => setCurrentSkin('minimal-hover')}>Minimal</button>
      </div>

      <video
        {...attrs}
        src="video.mp4"
        controls
      />
    </div>
  );
}

// Example 4: Preloading skins
export function VideoWithPreloadedSkins() {
  const [skins, setSkins] = useState<Record<string, SkinDefinition>>({});
  const [activeSkin, setActiveSkin] = useState<string>('base');

  useEffect(() => {
    // Preload all skins on mount
    Promise.all([
      loadSkinFromJsDelivr('0.1.0', 'skins/video/base.json'),
      loadSkinFromJsDelivr('0.1.0', 'skins/video/linear-inspired.json'),
      loadSkinFromJsDelivr('0.1.0', 'skins/video/minimal-hover.json'),
      loadSkinFromJsDelivr('0.1.0', 'skins/video/social-card.json'),
    ]).then(([base, linear, minimal, social]) => {
      setSkins({
        base,
        'linear-inspired': linear,
        'minimal-hover': minimal,
        'social-card': social,
      });
    });
  }, []);

  const skin = skins[activeSkin];
  if (!skin) return <div>Loading skins...</div>;

  const attrs = getVideoSkinAttributes(skin);

  return (
    <div>
      <select value={activeSkin} onChange={(e) => setActiveSkin(e.target.value)}>
        <option value="base">Base</option>
        <option value="linear-inspired">Linear Inspired</option>
        <option value="minimal-hover">Minimal Hover</option>
        <option value="social-card">Social Card</option>
      </select>

      <video {...attrs} src="video.mp4" controls />
    </div>
  );
}

// Example 5: Direct JSON import (for bundling)
import baseSkin from '@page-speed/skins/skins/video/base.json';

export function VideoWithImportedSkin() {
  const attrs = getVideoSkinAttributes(baseSkin as SkinDefinition);

  return <video {...attrs} src="video.mp4" controls />;
}
