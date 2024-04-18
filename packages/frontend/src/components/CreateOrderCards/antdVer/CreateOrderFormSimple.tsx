"use client"

import { FireIcon } from "@heroicons/react/24/outline"
import { Text, NumberInput, Button } from "@tremor/react"
import { TailSpin } from "react-loader-spinner"
import { Dispatch, SetStateAction, useState } from "react"
import { SPINNER_COLOR } from "@/constants"
import Receipt from "@/components/Receipt"
import { getGuaranteeValue, getRewardValue } from "@/utils/utils"
import TokenSearchSelect from "@/components/TokenSearchSelect"
import { TOKEN_NAME } from "@/constants/tokens"

import { Form, Input, List, Select, Tabs, TabsProps } from "antd"
const { Option } = Select

import { Buttons } from "@/components/buttons"
import CreateOrderCard from "@/components/CreateOrderCards/CreateOrderCard"

export default function CreateOrderFormSimple() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="mt-6 flex flex-col w-full">
      {/* Gas Amount, Token and Gas Price inputs */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="input-number-gas" className="base-text mb-1">
            Gas Amount
          </label>
          <Form.Item name="gasAmount" label="Gas Amount" rules={[{ required: true }]}>
            <Input
              min={0}
              spellCheck={false}
              placeholder="123"
              size="middle"
              className="h-12 p-3 rounded-6 border-normal dark:border-whiteDark hover:border-primary focus:border-primary dark:placeholder-white/60"
            />
          </Form.Item>
        </div>
        <div className="flex flex-col old-md:flex-row gap-4">
          <div className="flex flex-col grow justify-start ">
            <label htmlFor="token-select" className="base-text mb-1">
              Token
            </label>
            <Form.Item name={""}>
              <TokenSearchSelect />
            </Form.Item>
          </div>
          <div className="flex flex-col grow justify-start">
            <label htmlFor="input-number-gasCost" className="base-text mb-1">
              Gas Cost
            </label>
            <Form.Item>
              <Input
                value={inputValues.gasPricePerUnit.toString()}
                onChange={(e) => {
                  const gasPricePerUnit = Number(e.target.value)
                  setInputValues({
                    ...inputValues,
                    gasPricePerUnit,
                    guaranteePerUnit: getGuaranteeValue(inputValues.gasAmount, gasPricePerUnit),
                  })
                }}
                // error={!!validationErrors?.gasCostValueGasPrice}
                // errorMessage={validationErrors?.gasCostValueGasPrice}
                spellCheck={false}
                placeholder="123"
                size="middle"
                className="h-12 p-3 rounded-6 border-normal dark:border-whiteDark hover:border-primary focus:border-primary dark:placeholder-white/60"
              />
            </Form.Item>
          </div>
        </div>
      </div>
      <div className="flex flex-col old-sm:flex-row old-sm:items-end old-sm:justify-between gap-4 mt-4 old-sm:mt-8">
        <Receipt
          className=""
          //TODO pass correct token names
          gasAmount={inputValues.gasAmount}
          gasCostValue={inputValues.gasPricePerUnit}
          gasCostTokenName={TOKEN_NAME[inputValues.gasPriceToken] ?? inputValues.gasPriceToken}
        />

        <Form.Item>
          <Buttons type="primary" htmlType="submit" className="primary_btn">
            {"Create Gas Order"}
          </Buttons>
          {/* <Buttons onClick={handleSubmit} className="primary_btn">
          {"Create Gas Order"}
        </Buttons> */}
        </Form.Item>
      </div>
    </div>
  )
}