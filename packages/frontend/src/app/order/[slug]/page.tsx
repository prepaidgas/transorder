"use client"

// @todo fill the page with the basic order information
import { readContract } from "@wagmi/core"
import { useEffect, useState } from "react"
import format from "date-fns/format"

import { Title, Text, Card, Metric, Flex, ProgressBar, Icon } from "@tremor/react"
import { GasOrderABI } from "helpers/abi"
import { FilteredOrderStructOutput } from "typechain-types/GasOrder"
import { renderBadge } from "../../../utils/utils"
import { useAccount } from "wagmi"
import { STATUS_COLORS } from "../../../constants/themeConstants"
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"

export default function Page({ params }: { params: { slug: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [orderData, setOrderData] = useState<undefined | FilteredOrderStructOutput>()
  const { address, isConnecting, isDisconnected } = useAccount()
  const [isError, setIsError] = useState(false)

  const fetchOrderData = async () => {
    try {
      const data = await readContract({
        address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        abi: GasOrderABI,
        functionName: "getOrdersById",
        args: [[params.slug], address],
      })
      console.log("GetOrdersById DATA", data)
      setOrderData(data[0] as FilteredOrderStructOutput)
    } catch (e) {
      console.log("GetOrdersById ERROR: ", e)
      setIsError(true)
    }
  }

  useEffect(() => {
    fetchOrderData()
  }, [])

  return (
    <>
      <Title>Order number: {params.slug}</Title>
      {orderData && renderBadge(orderData.status)}
      {orderData && (
        <Card className="mt-3" decoration="top" decorationColor={STATUS_COLORS[Number(orderData.status)]}>
          {renderBadge(orderData.status)}

          {/* @dev Order Id */}
          <Metric>#{orderData.id.toString()}</Metric>

          <Text>Manager: {orderData.manager}</Text>
          {/* @dev Order executionPeriodStart and executionPeriodDeadline */}
          {/*"yyyy.mm.dd hh:ss:mm"*/}
          <Text>
            Execution timeframe: {format(new Date(Number(orderData.executionPeriodStart) * 1000), "MMM d y, HH:mm:ss")}{" "}
            - {format(new Date(Number(orderData.executionPeriodDeadline) * 1000), "MMM d y, HH:mm:ss")}
          </Text>
          {/* @dev Order executionWindow */}
          <Text>Execution window: {orderData.executionWindow.toString()}</Text>
          {/* @dev Order executionWindow */}
          {/* @dev Order data, the details might be found in `TokenAmountWithDetails` structure */}
          <Text>{`Reward: ${orderData.reward.value} ${orderData.reward.symbol}`}</Text>
          <Text>{`Gas Cost: ${orderData.gasCost.value} ${orderData.gasCost.symbol}`}</Text>
          <Text>{`Guarantee: ${orderData.guarantee.value} ${orderData.guarantee.symbol}`}</Text>
          {/* @dev Gas left (maxGas) */}
          <Flex className="mt-4">
            <Text>Used: 0 / {orderData.maxGas.toString()}</Text>
          </Flex>
          <ProgressBar value={32} className="mt-2" />
        </Card>
      )}
      {isError && (
        <Card className="mt-3" decoration="top" decorationColor="red">
          <div className="flex flex-row gap-4 justify-center items-center">
            <Icon icon={ExclamationCircleIcon} size="xl"></Icon>
            <Title>No such order was found</Title>
          </div>
        </Card>
      )}
    </>
  )
}