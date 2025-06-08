import { observer } from "mobx-react-lite";
import Image from "next/image";
import { FunctionComponent } from "react";

import { AprBreakdown } from "~/components/cards/apr-breakdown";
import { SkeletonLoader } from "~/components/loaders";
import { useFeatureFlags, useTranslation } from "~/hooks";
import { useStore } from "~/stores";
import { formatPretty } from "~/utils/formatter";
import { api } from "~/utils/trpc";

export const UserAssetsAndExternalIncentives: FunctionComponent<{ poolId: string }> =
  observer(({ poolId }) => {
    const { derivedDataStore } = useStore();
    const { t } = useTranslation();
    const featureFlags = useFeatureFlags();

    const concentratedPoolDetail =
      derivedDataStore.concentratedPoolDetails.get(poolId);

    const hasIncentives = concentratedPoolDetail.incentiveGauges.length > 0;

    const { data: incentives, isLoading: isLoadingIncentives } =
      api.edge.pools.getPoolIncentives.useQuery(
        {
          poolId,
        },
        {
          enabled: featureFlags.aprBreakdown,
        }
      );

    return (
      <div className="flex flex-wrap gap-4">
        <div className="flex shrink-0 items-center gap-8 rounded-3xl px-8 py-7">
          <div className="flex h-full flex-col place-content-between">
            <span className="body2 text-osmoverse-300">
              {t("clPositions.totalBalance")}
            </span>
            <div>
              <h4 className="text-osmoverse-100">
                {concentratedPoolDetail.userPoolValue.toString()}
              </h4>
              <span className="subtitle1 text-osmoverse-300">
                {concentratedPoolDetail.userPositions.length === 1
                  ? t("clPositions.onePosition")
                  : t("clPositions.numPositions", {
                    numPositions:
                      concentratedPoolDetail.userPositions.length.toString(),
                  })}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {concentratedPoolDetail.userPoolAssets.map(({ asset }) => (
              <div className="subtitle1 flex gap-2" key={asset.denom}>
                {asset.currency.coinImageUrl && (
                  <Image
                    alt="token-icon"
                    src={asset.currency.coinImageUrl}
                    width={20}
                    height={20}
                  />
                )}
                <span className="text-osmoverse-300">{asset.denom}</span>
                <span className="text-osmoverse-100">
                  {formatPretty(asset, { maxDecimals: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
        {featureFlags.aprBreakdown && (
          <SkeletonLoader isLoaded={!isLoadingIncentives}>
            <AprBreakdown
              className="shrink-0 rounded-3xl"
              showDisclaimerTooltip
              {...incentives?.aprBreakdown}
            />
          </SkeletonLoader>
        )}

        {hasIncentives && (
          <div className="flex h-full w-full flex-col place-content-between items-center rounded-3xl px-8 py-7">
            <span className="body2 mr-auto text-osmoverse-300">
              {t("pool.incentives")}
            </span>
            <div className="flex w-full items-center">
              {concentratedPoolDetail.incentiveGauges.map((incentive) => (
                <div
                  className="flex items-center gap-3"
                  key={incentive.coinPerDay.denom}
                >
                  <div className="flex items-center gap-1">
                    {incentive.apr && (
                      <span className="subtitle1 text-osmoverse-100">
                        +{incentive.apr.maxDecimals(0).toString()}
                      </span>
                    )}
                    {incentive.coinPerDay.currency.coinImageUrl && (
                      <Image
                        alt="token-icon"
                        src={incentive.coinPerDay.currency.coinImageUrl}
                        width={20}
                        height={20}
                      />
                    )}
                  </div>
                  <div className="subtitle1 flex flex-col gap-1 text-osmoverse-300">
                    <span>
                      {t("pool.dailyEarnAmount", {
                        amount: formatPretty(incentive.coinPerDay, {
                          maxDecimals: 2,
                        }),
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <span className="caption mr-auto text-osmoverse-500">
              *{t("pool.onlyInRangePositions")}
            </span>
          </div>
        )}
      </div>
    );
  });
