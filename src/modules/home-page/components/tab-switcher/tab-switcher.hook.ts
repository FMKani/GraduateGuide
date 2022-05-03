import * as React from "react";

export function useTabSwitcher() {
  const [tab, setTab] = React.useState(0);

  const changeTab = React.useRef((n: number) => {
    return () => setTab(n);
  });

  return { tab, changeTab: changeTab.current };
}
