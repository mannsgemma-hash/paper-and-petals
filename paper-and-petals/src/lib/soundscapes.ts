export type SoundscapeId = 'rain' | 'stream' | 'ocean';

export interface Soundscape {
  id: SoundscapeId;
  label: string;
  icon: string;
  src: number;
}

export const SOUNDSCAPES: Soundscape[] = [
  {
    id: 'rain',
    label: 'Rain',
    icon: 'cloud-rain',
    src: require('../../assets/audio/rain.mp3'),
  },
  {
    id: 'stream',
    label: 'Stream',
    icon: 'droplet',
    src: require('../../assets/audio/stream.mp3'),
  },
  {
    id: 'ocean',
    label: 'Ocean',
    icon: 'wind',
    src: require('../../assets/audio/ocean.mp3'),
  },
];
