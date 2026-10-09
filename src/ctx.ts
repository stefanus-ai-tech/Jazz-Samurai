import React from "react";

/** Lets montage scenes (rewind / recap) re-render any earlier moment of the video. */
export const RenderAt = React.createContext<(T: number) => React.ReactNode>(() => null);
