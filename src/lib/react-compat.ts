import React from "react";

// React 19 compatibility polyfill for legacy createFactory calls
if (typeof React !== "undefined" && !(React as any).createFactory) {
  (React as any).createFactory = (type: any) => React.createElement.bind(null, type);
}

export default React;
