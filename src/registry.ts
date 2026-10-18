import React from 'react';
import {SceneProps} from './scenes/types';
import {Placeholder} from './scenes/Placeholder';
import {ColdOpen} from './scenes/S00_ColdOpen';
import {RunToStar} from './scenes/S01_RunToStar';
import {Juggle} from './scenes/S02_Juggle';
import {DustCollapse} from './scenes/S03_DustCollapse';
import {ReachStar} from './scenes/S04_ReachStar';
import {FlowerBranch} from './scenes/S05_FlowerBranch';
import {
  EyeDream, GhostToBubble, QuestionHeart, EraserLoop, WritingNotebook,
  RainToFlower, NetChess, CrowdName, FlatWave,
} from './scenes/ActA';
import {
  TearCatch, GhostSmile, LedgerFly, EmptyEye, LetterboxScene,
  SingToRoad, WeatherMontage, ThakaanPukar,
} from './scenes/ActB';
import {
  WindowsCity, LanternWalk, CalendarFly, WindowHide, BridgeBuild,
  RoadDraws, Constellation, EmptyBubbles,
} from './scenes/ActC';
import {
  Kehkashan, GhostToggle, TravelerHouse, PathsConverge, RainStops,
  MemoryMontage, ParallelLines, AlmostTouch,
} from './scenes/ActD';
import {
  DreamHouseCrack, LeaveCity, MakanToStars, WarmFlashback, LastHug,
  EmptyBench, CountStars,
} from './scenes/ActE';
import {CityOneWindow, LanternAgain, ArsaHua, GhostGone, AmberSpark} from './scenes/ActF';

// comp naam (timeline.ts) -> component. Jo naam yahan nahi, wo Placeholder dikhata hai.
export const registry: Record<string, React.FC<SceneProps>> = {
  ColdOpen, RunToStar, Juggle, DustCollapse, ReachStar, FlowerBranch,
  EyeDream, GhostToBubble, QuestionHeart, EraserLoop, WritingNotebook, RainToFlower, NetChess, CrowdName, FlatWave,
  TearCatch, GhostSmile, LedgerFly, EmptyEye, LetterboxScene, SingToRoad, WeatherMontage, ThakaanPukar,
  WindowsCity, LanternWalk, CalendarFly, WindowHide, BridgeBuild, RoadDraws, Constellation, EmptyBubbles,
  Kehkashan, GhostToggle, TravelerHouse, PathsConverge, RainStops, MemoryMontage, ParallelLines, AlmostTouch,
  DreamHouseCrack, LeaveCity, MakanToStars, WarmFlashback, LastHug, EmptyBench, CountStars,
  CityOneWindow, LanternAgain, ArsaHua, GhostGone, AmberSpark,
};

export const getScene = (comp: string): React.FC<SceneProps> => registry[comp] ?? Placeholder;
