"use client"

import format from "date-fns/format"
import { writeContract, waitForTransaction } from "@wagmi/core"
import { MockTokenABI, GasOrderABI, prepaidGasCoreContractAddress } from "@/helpers"
import { parse, getHours, getMinutes, getSeconds } from "date-fns"
import { PaymentStruct, GasPaymentStruct } from "typechain-types/GasOrder"

import { CalendarDaysIcon, CheckIcon, ClockIcon, FireIcon, NoSymbolIcon } from "@heroicons/react/24/outline"
import { Text, NumberInput, Button, SearchSelect, SearchSelectItem } from "@tremor/react"
import { TailSpin } from "react-loader-spinner"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ETH_ADDRESS_REGEX, TIME_STRING_REGEX, SPINNER_COLOR } from "@/constants"
import { z } from "zod"
import { CreateOrderState } from "./CreateOrderCard"
import Receipt from "../Receipt"

export default function CreateOrderCardSimple({
  setInputValues,
  inputValues,
  validationErrors,
  handleSubmit,
}: {
  setShowDialogWindow: Dispatch<SetStateAction<boolean>>
  setTransactionDetails: Dispatch<SetStateAction<{}>>
  setInputValues: Dispatch<SetStateAction<{}>>
  inputValues: CreateOrderState
  validationErrors: null | { [key: string]: string }
  handleSubmit: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [wasRewardTransferChanged, setWasRewardTransferChanged] = useState(false)
  const [wasGasCostTransferChanged, setWasGasCostTransferChanged] = useState(false)

  const clampNumber = (value, minNum, maxNum) => {
    console.log("Clamped: ", value)
    if (value === 0) {
      return 0
    }

    if (value < minNum) {
      return minNum
    } else if (value > maxNum) {
      return maxNum
    } else {
      return value
    }
  }

  return (
    <div className="mt-6 flex flex-col w-full">
      {/* Gas Amount, Token and Gas Price inputs */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col">
          <Text>Gas</Text>
          <div className="flex flex-col mt-2">
            <NumberInput
              icon={FireIcon}
              value={inputValues.gasAmount.toString()}
              onChange={(e) =>
                setInputValues({ ...inputValues, gasAmount: clampNumber(Number(e.target.value), 0, 100000) })
              }
              error={!!validationErrors?.gasAmount}
              errorMessage={validationErrors?.gasAmount}
              spellCheck={false}
            />
          </div>
        </div>
        <div className="flex flex-col lg:grow">
          <Text>Gas Cost Token</Text>
          <SearchSelect
            className="mt-2"
            value={inputValues.gasCostValueToken}
            onValueChange={(value) =>
              setInputValues({
                ...inputValues,
                gasCostValueToken: value,
                guaranteeValueToken: value,
                rewardValueToken: value,
              })
            }
            spellCheck={false}
            placeholder="0x1dA..."
          >
            <SearchSelectItem value="Test0">Test0</SearchSelectItem>
            <SearchSelectItem value="Test1">Test1</SearchSelectItem>
            <SearchSelectItem value="Test2">Test2</SearchSelectItem>
            <SearchSelectItem value="Test3">Test3</SearchSelectItem>
          </SearchSelect>
        </div>
        <div className="flex flex-col lg:grow">
          <Text>Gas Cost GasPrice</Text>
          <NumberInput
            className="mt-2"
            value={inputValues.gasCostValueGasPrice.toString()}
            onChange={(e) => {
              const gasCostValueGasPrice = clampNumber(Number(e.target.value), 0, 100000)
              const gasCostTransfer = inputValues.gasAmount * gasCostValueGasPrice
              setInputValues({
                ...inputValues,
                gasCostValueGasPrice,
                guaranteeValueGasPrice: inputValues.gasAmount * gasCostValueGasPrice,
                rewardValueAmount: (inputValues.gasAmount / 10) * gasCostValueGasPrice,
              })
            }}
            error={!!validationErrors?.gasCostValueGasPrice}
            errorMessage={validationErrors?.gasCostValueGasPrice}
            spellCheck={false}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:gap-0 md:items-end md:flex-row md:justify-between mt-4">
        <Receipt
          //TODO pass correct token names
          gasAmount={inputValues.gasAmount}
          gasCostTokenName="TRX"
          gasCostValue={inputValues.gasCostValueGasPrice}
          rewardTokenName="USDT"
          rewardValue={inputValues.rewardValueAmount}
        />
        <Button className="grow md:grow-0" disabled={isLoading} onClick={handleSubmit}>
          {/* <Button onClick={() => setIsLoading(!isLoading)}> */}
          <TailSpin
            height={20}
            width={20}
            color={SPINNER_COLOR}
            ariaLabel="tail-spin-loading"
            radius="0"
            wrapperStyle={{}}
            wrapperClass=""
            visible={isLoading}
          />
          {isLoading ? "" : "Create Gas Order"}
        </Button>
      </div>
    </div>
  )
}
