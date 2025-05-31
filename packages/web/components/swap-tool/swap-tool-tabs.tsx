import classNames from "classnames";
import { FunctionComponent, useMemo } from "react";

import { useTranslation } from "~/hooks";

export enum SwapToolTab {
  SWAP = "swap",
  BUY = "buy",
  SELL = "sell",
}

interface SwapToolTabsProps {
  setTab: (tab: SwapToolTab) => void;
  activeTab: SwapToolTab;
}

/**
 * Component for swapping between tabs on the swap modal.
 * Has three tabs:
 * - Buy
 * - Sell
 * - Swap
 */
export const SwapToolTabs: FunctionComponent<SwapToolTabsProps> = ({
  setTab,
  activeTab,
}) => {
  const { t } = useTranslation();

  const tabs = useMemo(
    () => [
      {
        label: t("portfolio.buy"),
        value: SwapToolTab.BUY,
      },
      {
        label: t("limitOrders.sell"),
        value: SwapToolTab.SELL,
      },
      {
        label: t("swap.title"),
        value: SwapToolTab.SWAP,
      },
    ],
    [t]
  );

  return (
    <div className="flex w-max items-center gap-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={`swap-tab-${tab.value}`}
            onClick={() => setTab(tab.value)}
            style={{
              fontWeight: "400",
            }}
            className={classNames(
              "sm:body2 -m-px rounded-3xl px-6 py-3 transition-colors sm:px-3 sm:py-1.5 MaanyLight  border border-osmoverse-400",
              {
                "hover:bg-osmoverse-900": !isActive,
                "bg-osmoverse-400": isActive,
              }
            )}
          >
            <p
              className={classNames("", {
                "text-osmoverse-400": !isActive,
                "text-osmoverse-900": isActive,
              })}
            >
              {tab.label}
            </p>
          </button>
        );
      })}
    </div>
  );
};
