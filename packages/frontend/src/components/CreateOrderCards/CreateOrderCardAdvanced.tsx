"use client"

import {
  getTomorrowStartDate,
  getTomorrowEndDate,
  parseTime,
  combineDateAndTime,
  getUnixTimestampInSeconds,
} from "@/utils/dateAndTime.utils"
import format from "date-fns/format"

import { writeContract, waitForTransaction } from "@wagmi/core"
import { MockTokenABI, GasOrderABI } from "@/helpers/abi"
import { PaymentStruct, GasPaymentStruct } from "typechain-types/GasOrder"

import { CalendarDaysIcon, CheckIcon, ClockIcon, FireIcon, NoSymbolIcon } from "@heroicons/react/24/outline"
import {
  Card,
  Text,
  TextInput,
  NumberInput,
  DatePicker,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Icon,
  Button,
  DatePickerValue,
  SearchSelect,
  SearchSelectItem,
} from "@tremor/react"
import { TailSpin } from "react-loader-spinner"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ETH_ADDRESS_REGEX, TIME_STRING_REGEX, SPINNER_COLOR } from "@/constants"
import { z } from "zod"
import { CreateOrderState } from "./CreateOrderCard"
import Receipt from "../Receipt"
import { getGuaranteeValue, getRewardValue } from "@/utils/utils"

export default function CreateOrderCardAdvanced({
  setInputValues,
  inputValues,
  validationErrors,
  handleSubmit,
}: {
  setInputValues: Dispatch<SetStateAction<{}>>
  inputValues: CreateOrderState
  validationErrors: null | { [key: string]: string }
  handleSubmit: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [wasGasPriceChanged, setWasGasPriceChanged] = useState(false)
  const [wasRewardValueChanged, setWasRewardValueChanged] = useState(false)
  const [wasGuaranteeValueChanged, setWasGuaranteeValueChanged] = useState(false)
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
      {/* Gas Amount and Date & Time Settings */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col">
          <Text>Gas</Text>
          <div className="flex flex-col mt-2">
            <NumberInput
              icon={FireIcon}
              value={inputValues.gasAmount.toString()}
              //onChange={(e) => setInputValues({ ...inputValues, gasAmount: Number(e.target.value) })}
              onChange={(e) => {
                setInputValues({ ...inputValues, gasAmount: Number(e.target.value) })
                const gasAmount = Number(e.target.value)
                if (
                  wasGasPriceChanged === false &&
                  wasRewardValueChanged === false &&
                  wasGuaranteeValueChanged === false &&
                  wasGasCostTransferChanged === false &&
                  wasRewardTransferChanged === false
                ) {
                  setInputValues({
                    ...inputValues,
                    gasAmount,
                    guaranteeValueGasPrice: getGuaranteeValue(gasAmount, inputValues.gasCostValueGasPrice),
                    rewardValueAmount: getRewardValue(gasAmount, inputValues.gasCostValueGasPrice),
                    gasCostTransfer: getGuaranteeValue(gasAmount, inputValues.gasCostValueGasPrice),
                    rewardTransfer: getRewardValue(gasAmount, inputValues.gasCostValueGasPrice),
                  })
                }
              }}
              min={0}
              error={!!validationErrors?.gasAmount}
              errorMessage={validationErrors?.gasAmount}
              spellCheck={false}
            />
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <Text>Execution period Start</Text>
          <div className="flex flex-row mt-2">
            <DatePicker
              color="red"
              value={inputValues.executionPeriodStartDate}
              onValueChange={(value) => setInputValues({ ...inputValues, executionPeriodStartDate: value })}
              minDate={inputValues.executionPeriodStartDate}
            />
          </div>
          <div className="flex flex-row mt-2">
            <TextInput
              icon={ClockIcon}
              value={inputValues.executionPeriodStartTime}
              onChange={(e) => setInputValues({ ...inputValues, executionPeriodStartTime: e.target.value })}
              placeholder={inputValues.executionPeriodStartTime}
              error={!!validationErrors?.executionPeriodStartTime}
              errorMessage={validationErrors?.executionPeriodStartTime}
              spellCheck={false}
            ></TextInput>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <Text>Execution period End</Text>
          <div className="flex flex-row mt-2">
            <DatePicker
              value={inputValues.executionPeriodEndDate}
              onValueChange={(value) => setInputValues({ ...inputValues, executionPeriodEndDate: value })}
              minDate={inputValues.executionPeriodStartDate}
            />
          </div>
          <div className="flex flex-row mt-2">
            <TextInput
              icon={ClockIcon}
              value={inputValues.executionPeriodEndTime}
              onChange={(e) => setInputValues({ ...inputValues, executionPeriodEndTime: e.target.value })}
              placeholder={inputValues.executionPeriodEndTime}
              error={!!validationErrors?.executionPeriodEndTime}
              errorMessage={validationErrors?.executionPeriodEndTime}
              spellCheck={false}
            ></TextInput>
          </div>
        </div>
      </div>

      {/* Reward Settings */}
      <div className="flex flex-col mt-4 lg:flex-row gap-6">
        <div className="flex flex-col lg:grow">
          <Text>Reward Token</Text>
          <SearchSelect
            className="mt-2"
            value={inputValues.rewardValueToken}
            onValueChange={(value) =>
              setInputValues({
                ...inputValues,
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
          <Text>Reward Amount</Text>
          <NumberInput
            className="mt-2"
            value={inputValues.rewardValueAmount.toString()}
            onChange={(e) => {
              const rewardValueAmount = Number(e.target.value)
              wasRewardTransferChanged
                ? setInputValues({ ...inputValues, rewardValueAmount })
                : setInputValues({ ...inputValues, rewardValueAmount, rewardTransfer: rewardValueAmount })
            }}
            error={!!validationErrors?.rewardValueAmount}
            errorMessage={validationErrors?.rewardValueAmount}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Gas Cost Settings */}
      <div className="flex flex-col mt-4 lg:flex-row gap-6">
        <div className="flex flex-col lg:grow">
          <Text>Gas Cost Token</Text>
          <SearchSelect
            className="mt-2"
            value={inputValues.gasCostValueToken}
            onValueChange={(value) =>
              setInputValues({
                ...inputValues,
                gasCostValueToken: value,
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
              wasGasCostTransferChanged
                ? setInputValues({
                    ...inputValues,
                    gasCostValueGasPrice,
                  })
                : setInputValues({
                    ...inputValues,
                    gasCostValueGasPrice,
                    gasCostTransfer: inputValues.gasAmount * gasCostValueGasPrice,
                  })
            }}
            error={!!validationErrors?.gasCostValueGasPrice}
            errorMessage={validationErrors?.gasCostValueGasPrice}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Guarantee Settings */}
      <div className="flex flex-col mt-4 lg:flex-row gap-6">
        <div className="flex flex-col lg:grow">
          <Text>Guarantee Token</Text>
          <SearchSelect
            className="mt-2"
            value={inputValues.guaranteeValueToken}
            onValueChange={(value) =>
              setInputValues({
                ...inputValues,
                guaranteeValueToken: value,
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
          <Text>Guarantee GasPrice</Text>
          <NumberInput
            className="mt-2"
            value={inputValues.guaranteeValueGasPrice.toString()}
            onChange={(e) =>
              setInputValues({ ...inputValues, guaranteeValueGasPrice: clampNumber(Number(e.target.value), 0, 100000) })
            }
            error={!!validationErrors?.guaranteeValueGasPrice}
            errorMessage={validationErrors?.guaranteeValueGasPrice}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="flex flex-col lg:flex-row gap-6 mt-4">
        <div className="flex flex-col">
          <Text>Execution window</Text>
          <NumberInput
            className="mt-2"
            value={inputValues.executionWindow.toString()}
            onChange={(e) =>
              setInputValues({ ...inputValues, executionWindow: clampNumber(Number(e.target.value), 0, 100000) })
            }
            error={!!validationErrors?.executionWindow}
            errorMessage={validationErrors?.executionWindow}
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col ">
          <Text>Reward transfer</Text>
          <NumberInput
            className="mt-2"
            value={inputValues.rewardTransfer.toString()}
            onChange={(e) => {
              setInputValues({ ...inputValues, rewardTransfer: clampNumber(Number(e.target.value), 0, 100000) })
              setWasRewardTransferChanged(true)
            }}
            error={!!validationErrors?.rewardTransfer}
            errorMessage={validationErrors?.rewardTransfer}
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col ">
          <Text>Gas cost transfer</Text>
          <NumberInput
            className="mt-2"
            value={inputValues.gasCostTransfer.toString()}
            onChange={(e) => {
              setInputValues({ ...inputValues, gasCostTransfer: clampNumber(Number(e.target.value), 0, 100000) })
              setWasGasCostTransferChanged(true)
            }}
            error={!!validationErrors?.gasCostTransfer}
            errorMessage={validationErrors?.gasCostTransfer}
            spellCheck={false}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:gap-0 md:items-end md:flex-row md:justify-between mt-4">
        <Receipt
          //TODO pass correct token names
          gasAmount={inputValues.gasAmount}
          gasCostValue={inputValues.gasCostValueGasPrice}
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
