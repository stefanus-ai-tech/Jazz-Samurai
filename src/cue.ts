import type { Tr } from "./Transitions";
import type { SceneFC } from "./scenes/kit";

export type Cue = { at: number; S: SceneFC; tr?: Tr; trd?: number; montage?: boolean };
