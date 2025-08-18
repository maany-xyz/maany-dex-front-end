import { Dec } from "@osmosis-labs/unit";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useSearchParam } from "react-use";

import { PoolAssetsIcon, PoolAssetsName } from "~/components/assets";
import {
  ChartUnavailable,
  PriceChartHeader,
} from "~/components/chart/price-historical";
import { Spinner } from "~/components/loaders/spinner";
import { Button, ChartButton } from "~/components/ui/button";
import { useTranslation } from "~/hooks";
import {
  ObservableHistoricalAndLiquidityData,
  useHistoricalAndLiquidityData,
} from "~/hooks/ui-config/use-historical-and-depth-data";
import { AddLiquidityModal } from "~/modals";
import { theme } from "~/tailwind.config";
import { formatPretty, getPriceExtendedFormatOptions } from "~/utils/formatter";
import { removeQueryParam } from "~/utils/url";

const HistoricalPriceChart = dynamic(
  () =>
    import("~/components/chart/price-historical").then(
      (module) => module.HistoricalPriceChart
    ),
  { ssr: false }
);

const OpenCreatePositionSearchParam = "open_create_position";

export const ConcentratedLiquidityPool: FunctionComponent<{ poolId: string }> =
  observer(({ poolId }) => {
    const router = useRouter();
    const { id } = router.query;
    const { t } = useTranslation();
    const openCreatePosition = useSearchParam(OpenCreatePositionSearchParam);

    const chartConfig = useHistoricalAndLiquidityData(poolId);
    const [activeModal, setActiveModal] = useState<
      "add-liquidity" | "learn-more" | null
    >(null);

    const { pool, resetZoom, zoomIn, zoomOut } = chartConfig;

    useEffect(() => {
      if (openCreatePosition === "true") {
        setActiveModal("add-liquidity");
        removeQueryParam(OpenCreatePositionSearchParam);
      }
    }, [openCreatePosition]);

    return (
      <main className="m-auto flex min-h-screen max-w-container flex-col gap-8 px-8 py-4 md:gap-4 md:p-4">
        {pool && activeModal === "add-liquidity" && (
          <AddLiquidityModal
            isOpen={true}
            poolId={pool.id}
            onRequestClose={() => setActiveModal(null)}
          />
        )}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col rounded-3xl p-8">
            <div className={"flex flex-row justify-between mb-10"}>
              <h1 className={"MH4 text-osmoverse-400"}>POOL #{id}</h1>
              <Button
                title={"Trade"}
                titleClassName={"MH7 px-6"}
                onClick={() => {
                  setActiveModal("add-liquidity");
                }}
              />
            </div>
            <div className="flex flex-row lg:flex-col lg:gap-3">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <PoolAssetsIcon
                    className="!w-[78px]"
                    assets={pool?.reserveCoins.map((coin) => ({
                      coinImageUrl: coin.currency.coinImageUrl,
                      coinDenom: coin.currency.coinDenom,
                    }))}
                  />
                  <div className="flex flex-wrap gap-x-2">
                    <div>
                      <PoolAssetsName
                        size="md"
                        className="text-h5 font-h5"
                        assetDenoms={pool?.reserveCoins.map(
                          (asset) => asset.currency.coinDenom
                        )}
                      />
                      <span className="body2 text-success">
                        ☇ {t("clPositions.supercharged")}
                      </span>
                    </div>
                    <span className="hidden py-1 text-subtitle1 text-osmoverse-100 lg:inline-block">
                      {pool?.spreadFactor ? pool.spreadFactor.toString() : "0%"}{" "}
                      {t("clPositions.spreadFactor")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-grow justify-end gap-10 lg:justify-start xs:flex-col xs:gap-4">
                {pool?.market?.volume24hUsd && (
                  <PoolDataGroup
                    label={t("pool.24hrTradingVolume")}
                    value={formatPretty(pool.market.volume24hUsd)}
                  />
                )}
                <PoolDataGroup
                  label={t("pool.liquidity")}
                  value={
                    pool?.totalFiatValueLocked
                      ? formatPretty(pool.totalFiatValueLocked)
                      : "0"
                  }
                />

                <div className="lg:hidden">
                  <PoolDataGroup
                    label={t("clPositions.spreadFactor")}
                    value={
                      pool?.spreadFactor ? pool.spreadFactor.toString() : "0%"
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="flex-shrink-1 flex w-0 flex-1 flex-col gap-[20px] py-7 sm:py-3">
                {!chartConfig.isHistoricalDataLoading &&
                  !chartConfig.historicalChartUnavailable && (
                    <>
                      <ChartHeader config={chartConfig} />
                    </>
                  )}
              </div>

              <div className="flex-shrink-1 relative flex w-[229px] flex-col">
                <div className="mt-7 flex h-6 justify-end gap-1 pr-8 sm:pr-0">
                  <ChartButton
                    alt="refresh"
                    icon="refresh-ccw"
                    selected={false}
                    onClick={() => resetZoom()}
                  />
                  <ChartButton
                    alt="zoom out"
                    icon="zoom-out"
                    selected={false}
                    onClick={zoomOut}
                  />
                  <ChartButton
                    alt="zoom in"
                    icon="zoom-in"
                    selected={false}
                    onClick={zoomIn}
                  />
                </div>
              </div>
            </div>
            <div className={"flex h-[340px] min-w-[50rem] flex-row relative"}>
              {!chartConfig.historicalChartUnavailable && (
                <div className="flex-shrink-1 flex w-0 flex-1 flex-col gap-[20px] py-7 sm:py-3">
                  {chartConfig.isHistoricalDataLoading ? (
                    <Spinner className="m-auto" />
                  ) : !chartConfig.historicalChartUnavailable ? (
                    <>
                      <Chart config={chartConfig} />
                    </>
                  ) : (
                    <ChartUnavailable />
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  });

const PoolDataGroup: FunctionComponent<{
  label: string;
  value: string;
  className?: string;
}> = ({ label, value, className }) => (
  <div className={classNames("flex flex-col gap-2", className)}>
    <div className="text-body2 font-body2 text-osmoverse-400">{label}</div>
    <h4 className="text-osmoverse-100">{value}</h4>
  </div>
);

/**
 * Create a nested component to prevent unnecessary re-rendering whenever the hover price changes.
 */
const ChartHeader: FunctionComponent<{
  config: ObservableHistoricalAndLiquidityData;
}> = observer(({ config }) => {
  const {
    historicalRange,
    priceDecimal,
    setHistoricalRange,
    baseDenom,
    quoteDenom,
    hoverPrice,
  } = config;

  const formatOpts = useMemo(
    () => getPriceExtendedFormatOptions(new Dec(hoverPrice)),
    [hoverPrice]
  );

  return (
    <PriceChartHeader
      formatOpts={formatOpts}
      historicalRange={historicalRange}
      setHistoricalRange={setHistoricalRange}
      baseDenom={baseDenom}
      quoteDenom={quoteDenom}
      hoverPrice={hoverPrice}
      decimal={priceDecimal}
      classes={{
        buttons: "sm:hidden",
        pricesHeaderContainerClass: "sm:flex-col",
      }}
    />
  );
});

/**
 * Create a nested component to prevent unnecessary re-rendering whenever the hover price changes.
 */
const Chart: FunctionComponent<{
  config: ObservableHistoricalAndLiquidityData;
}> = observer(({ config }) => {
  const {
    historicalChartData,
    yRange,
    setHoverPrice,
    lastChartData,
    currentPrice,
  } = config;
  const formatOpts = useMemo(
    () => getPriceExtendedFormatOptions(currentPrice),
    [currentPrice]
  );
  return (
    <HistoricalPriceChart
      data={historicalChartData}
      annotations={[]}
      domain={yRange}
      showGradient={false}
      showLastValueOnDataPoint
      lastValueString={formatPretty(currentPrice, formatOpts)}
      nonGradientColor={theme.colors.wosmongton["700"]}
      onPointerHover={setHoverPrice}
      onPointerOut={() => {
        if (lastChartData) {
          setHoverPrice(Number(currentPrice.toString()));
        }
      }}
    />
  );
});
