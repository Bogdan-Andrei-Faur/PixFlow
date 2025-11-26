import * as React from "react";

interface UseResizeToolProps {
  natural: { w: number; h: number } | null;
}

export function useResizeTool({ natural }: UseResizeToolProps) {
  const [newWidth, setNewWidth] = React.useState<number>(0);
  const [newHeight, setNewHeight] = React.useState<number>(0);
  const [maintainAspect, setMaintainAspect] = React.useState(true);

  const handleWidthChange = React.useCallback(
    (w: number) => {
      setNewWidth(w);
      if (maintainAspect && natural) {
        setNewHeight(Math.round((w * natural.h) / natural.w));
      }
    },
    [maintainAspect, natural]
  );

  const handleHeightChange = React.useCallback(
    (h: number) => {
      setNewHeight(h);
      if (maintainAspect && natural) {
        setNewWidth(Math.round((h * natural.w) / natural.h));
      }
    },
    [maintainAspect, natural]
  );

  const initializeResize = React.useCallback(() => {
    if (natural) {
      setNewWidth(natural.w);
      setNewHeight(natural.h);
    }
  }, [natural]);

  return {
    newWidth,
    newHeight,
    maintainAspect,
    setMaintainAspect,
    handleWidthChange,
    handleHeightChange,
    initializeResize,
  };
}
