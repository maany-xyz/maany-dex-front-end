// @ts-nocheck
// @eslint-disable-file
import { Dec } from "@osmosis-labs/unit";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useSearchParam } from "react-use";

import { Icon, PoolAssetsIcon, PoolAssetsName } from "~/components/assets";
import { ChartUnavailable } from "~/components/chart";
import { MyPositionsSection } from "~/components/complex/my-positions-section";
import { SuperchargePool } from "~/components/funnels/concentrated-liquidity";
import { Spinner } from "~/components/loaders";
import { Button, ChartButton } from "~/components/ui/button";
import { EventName } from "~/config";
import {
  useAmplitudeAnalytics,
  useTranslation,
  useWalletSelect,
} from "~/hooks";
import { useHistoricalAndLiquidityData } from "~/hooks/ui-config/use-historical-and-depth-data";
import { AddLiquidityModal } from "~/modals";
import { ConcentratedLiquidityLearnMoreModal } from "~/modals/concentrated-liquidity-intro";
import { useStore } from "~/stores";
import { formatPretty, getPriceExtendedFormatOptions } from "~/utils/formatter";
import { api } from "~/utils/trpc";
import { removeQueryParam } from "~/utils/url";

const OpenCreatePositionSearchParam = "open_create_position";

export const ConcentratedLiquidityPool: FunctionComponent<{ poolId: string }> =
  observer(({ poolId }) => {
    const { chainStore, accountStore } = useStore();
    const { t } = useTranslation();
    const { logEvent } = useAmplitudeAnalytics();
    const { isLoading: isWalletLoading } = useWalletSelect();
    const account = accountStore.getWallet(chainStore.osmosis.chainId);
    const openCreatePosition = useSearchParam(OpenCreatePositionSearchParam);

    const chartConfig = useHistoricalAndLiquidityData(poolId);
    const [activeModal, setActiveModal] = useState<
      "add-liquidity" | "learn-more" | null
    >(null);

    const { data: superfluidPoolIds } =
      api.edge.pools.getSuperfluidPoolIds.useQuery();

    const { data: userPositions, isFetched: isUserPositionsFetched } =
      api.local.concentratedLiquidity.getUserPositions.useQuery(
        {
          userOsmoAddress: account?.address ?? "",
          forPoolId: poolId,
        },
        {
          enabled: !isWalletLoading && Boolean(account?.address),
        }
      );

    const userHasPositionInPool = userPositions && userPositions.length > 0;

    const claimableSpreadRewardPositions = useMemo(
      () =>
        userPositions?.filter(
          ({ position }) => position.claimable_spread_rewards.length > 0
        ) ?? [],
      [userPositions]
    );
    const claimableIncentivePositions = useMemo(
      () =>
        userPositions?.filter(
          ({ position }) => position.claimable_incentives.length > 0
        ) ?? [],
      [userPositions]
    );
    const hasClaimableRewards =
      claimableSpreadRewardPositions.length > 0 ||
      claimableIncentivePositions.length > 0;

    const {
      pool,
      currentPrice,
      xRange,
      yRange,
      lastChartData,
      depthChartData,
      resetZoom,
      zoomIn,
      zoomOut,
    } = chartConfig;

    const onClickCollectAllRewards = () => {
      logEvent([EventName.ConcentratedLiquidity.claimAllRewardsClicked]);
      account!.osmosis
        .sendCollectAllPositionsRewardsMsgs(
          claimableSpreadRewardPositions.map(({ id }) => id),
          claimableIncentivePositions.map(({ id }) => id),
          undefined,
          (tx) => {
            if (!tx.code) {
              logEvent([
                EventName.ConcentratedLiquidity.claimAllRewardsCompleted,
              ]);
            }
          }
        )
        .catch(console.error);
    };

    useEffect(() => {
      if (openCreatePosition === "true") {
        setActiveModal("add-liquidity");
        removeQueryParam(OpenCreatePositionSearchParam);
      }
    }, [openCreatePosition]);

    const formatOpts = useMemo(
      () => getPriceExtendedFormatOptions(currentPrice),
      [currentPrice]
    );

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
                    <PoolAssetsName
                      size="md"
                      className="text-h5 font-h5"
                      assetDenoms={pool?.reserveCoins.map(
                        (asset) => asset.currency.coinDenom
                      )}
                    />
                    <span className="hidden py-1 text-subtitle1 text-osmoverse-100 lg:inline-block">
                      {pool?.spreadFactor ? pool.spreadFactor.toString() : "0%"}{" "}
                      {t("clPositions.spreadFactor")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-ion-400">
                    <Icon id="lightning-small" height={18} width={18} />
                    <span className="body2">
                      {t("clPositions.supercharged")}
                    </span>
                  </div>
                  {superfluidPoolIds?.includes(poolId) && (
                    <span className="body2 text-supercharged-gradient flex items-center gap-1.5">
                      <Image
                        alt=""
                        src="/icons/superfluid-osmo.svg"
                        height={18}
                        width={18}
                      />
                      {t("pool.superfluidEnabled")}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-grow justify-end gap-10 lg:justify-start xs:flex-col xs:gap-4">
                {pool?.market?.volume24hUsd && (
                  <PoolDataGroup
                    label={t("pool.24hrTradingVolume")}
                    value={formatPretty(pool.market.volume24hUsd)}
                  />
                )}
                {/* eslint-disable-next-line react/jsx-no-undef */}
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
            <div className="flex h-[340px] flex-row">
              <div className="flex-shrink-1 flex w-0 flex-1 flex-col gap-[20px] py-7 sm:py-3">
                {chartConfig.isHistoricalDataLoading ? (
                  <Spinner className="m-auto" />
                ) : !chartConfig.historicalChartUnavailable ? (
                  <>
                    <ChartHeader config={chartConfig} />
                  </>
                ) : (
                  <ChartUnavailable />
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
            <div className={"flex flex-row"}>
              {!chartConfig.historicalChartUnavailable && (
                <Chart config={chartConfig} />
              )}
              {currentPrice && (
                <h6
                  className={classNames("max-w-[2rem] text-right", {
                    caption: currentPrice.lt(new Dec(0.01)),
                  })}
                >
                  {formatPretty(currentPrice, formatOpts)}
                </h6>
              )}
            </div>
          </div>
          <UserAssetsAndExternalIncentives poolId={poolId} />
          <div className="flex flex-col gap-8">
            <div className="flex flex-row md:flex-wrap md:gap-y-4">
              <div className="flex flex-grow flex-col gap-3">
                <h6>{t("clPositions.yourPositions")}</h6>
                <div className="flex items-center text-body2 font-body2">
                  <span className="text-osmoverse-200">
                    {t("clPositions.yourPositionsDesc")}
                  </span>
                  {/* <span className="flex flex-row">
                    <a
                      className="mx-1 inline-flex items-center text-wosmongton-300 underline"
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("clPositions.learnMoreAboutPools")}
                    </a>
                  </span> */}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="subtitle1 w-fit"
                  onClick={onClickCollectAllRewards}
                  disabled={!hasClaimableRewards}
                >
                  {t("clPositions.collectAllRewards")}
                </Button>

                <Button
                  variant="outline"
                  className="subtitle1 w-fit"
                  onClick={() => {
                    setActiveModal("add-liquidity");
                  }}
                >
                  {t("clPositions.createAPosition")}
                </Button>
              </div>
            </div>
            {!userHasPositionInPool && isUserPositionsFetched && (
              <>
                <SuperchargePool
                  title={t("createFirstPositionCta.title")}
                  caption={t("createFirstPositionCta.caption")}
                  primaryCta={t("createFirstPositionCta.primaryCta")}
                  secondaryCta={t("createFirstPositionCta.secondaryCta")}
                  onCtaClick={() => {
                    setActiveModal("add-liquidity");
                  }}
                  onSecondaryClick={() => {
                    setActiveModal("learn-more");
                  }}
                  className="bg-osmoverse-900"
                />
                <ConcentratedLiquidityLearnMoreModal
                  isOpen={activeModal === "learn-more"}
                  onRequestClose={() => setActiveModal(null)}
                />
              </>
            )}
            <MyPositionsSection forPoolId={poolId} />
          </div>
        </section>
      </main>
    );
  });
