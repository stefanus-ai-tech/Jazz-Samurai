import { useId } from "react";

/** SVG-safe unique id (React ids contain characters that break url(#…) refs). */
export const useUid = (p = "u") => p + useId().replace(/[^a-zA-Z0-9]/g, "");
