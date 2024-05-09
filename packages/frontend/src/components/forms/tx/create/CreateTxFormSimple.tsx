"use client"

import { DatePicker, Form, FormInstance, FormProps, Input, Select, TimePicker } from "antd"

import { useEffect, useState } from "react"
import { ABIEntry, FieldEntry, prepaidGasCoreContractAddress } from "@/helpers"
import dayjs, { Dayjs } from "dayjs"
import { Buttons } from "@/components/buttons"
import { TEST_ABI_STRING } from "@/constants"

export type SimpleTxProps = {
  nonce: number
  gasOrder: number
  deadlineDate: Dayjs
  deadlineTime: Dayjs
  to: string
  gas: number
  userAbi: string
  selectedFunction: string
}

const initialState: SimpleTxProps = {
  nonce: Date.now(),
  gasOrder: 0,
  deadlineDate: dayjs().add(1, "d"),
  deadlineTime: dayjs("00:00", "HH:mm"),
  to: "0x0000000000000000000000000000000000000000",
  gas: 25000,
  userAbi: TEST_ABI_STRING,
  selectedFunction: "",
  argValues: [],
}

export default function CreateTxFormSimple({
  form,
  handleSubmit,
  disabled,
}: {
  form: FormInstance<SimpleTxProps>
  handleSubmit: (values: SimpleTxProps) => void
  disabled: boolean
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAbiParsed, setIsAbiParsed] = useState(false)
  const [numberOfOrders, setNumberOfOrders] = useState(0)

  const parseAbi = () => {
    setIsAbiParsed(false)
    try {
      let parsed = JSON.parse(inputValues.userAbi)
      console.log("Parsed ABI: ", parsed)
      parsed = parsed.filter((item) => item.type === "function")
      console.log("Filtered ABI: ", parsed)

      setParsedAbi(parsed)
      setIsAbiParsed(true)
    } catch (e) {
      console.log("parseAbi Error: ", e)
    }
  }

  const resolveComponent = (comp: FieldEntry, index: number, isNested: boolean = false) => {
    console.log("Comp: ", comp)
    console.log("Index: ", index)
    console.log("IsNested: ", isNested)

    if (comp.components) {
      return (
        <div className="flex flex-col mt-4 ml-4">
          <span className="base-text">{comp.name}</span>
          <div className="ml-4">{comp.components.map((item) => resolveComponent(item, index, true))}</div>
        </div>
      )
    }

    if (isNested) {
      switch (comp.type) {
        case "uint256":
          return (
            <div className="flex flex-col">
              <label className="mt-4 base-text">{comp.name}</label>
              <Input
                onChange={(e) => {
                  setArgValues((prevState) => {
                    const nextState = [...prevState]
                    nextState[index] = { ...nextState[index], [comp.name]: Number(e.target.value) }
                    return nextState
                  })
                }}
                className="h-12 p-3 rounded-6 border-normal dark:border-whiteDark hover:border-primary focus:border-primary dark:placeholder-white/60"
              />
            </div>
          )
        case "bool":
          return (
            <div className="flex flex-col">
              <label className="mt-4 base-text">{comp.name}</label>
              <Select
                className="min-w-[8rem]"
                onChange={(value) => {
                  setArgValues((prevState) => {
                    const nextState = [...prevState]
                    nextState[index] = { ...nextState[index], [comp.name]: value }
                    return nextState
                  })
                }}
              >
                <Select.Option value="false">No</Select.Option>
                <Select.Option value="true">Yes</Select.Option>
              </Select>
            </div>
          )
        case "string":
        case "address":
        default:
          return (
            <div className="flex flex-col">
              <label className="mt-4 base-text">{comp.name}</label>
              {/* <TextInput
                onChange={(e) => {
                  setArgValues((prevState) => {
                    const nextState = [...prevState]
                    nextState[index] = { ...nextState[index], [comp.name]: e.target.value }
                    return nextState
                  })
                }}
              ></TextInput> */}
              <Input
                onChange={(e) => {
                  setArgValues((prevState) => {
                    const nextState = [...prevState]
                    nextState[index] = { ...nextState[index], [comp.name]: e.target.value }
                    return nextState
                  })
                }}
                className="h-12 p-3 rounded-6 border-normal dark:border-whiteDark hover:border-primary focus:border-primary dark:placeholder-white/60"
              />
            </div>
          )
      }
    }

    switch (comp.type) {
      case "string":
      case "address":
        return (
          <div className="flex flex-col">
            <label className="mt-4 base-text">{comp.name}</label>
            {/* <TextInput onChange={(e) => handleArgInputChange(e.target.value, index)}></TextInput> */}
            <Input
              onChange={(e) => handleArgInputChange(e.target.value, index)}
              className="h-12 p-3 rounded-6 border-normal dark:border-whiteDark hover:border-primary focus:border-primary dark:placeholder-white/60"
            />
          </div>
        )
      case "uint256":
        return (
          <div className="flex flex-col">
            <label className="mt-4 base-text">{comp.name}</label>
            {/* <NumberInput onChange={(e) => handleArgInputChange(Number(e.target.value), index)}></NumberInput> */}
            <Input
              onChange={(e) => handleArgInputChange(Number(e.target.value), index)}
              className="h-12 p-3 rounded-6 border-normal dark:border-whiteDark hover:border-primary focus:border-primary dark:placeholder-white/60"
            />
          </div>
        )
      case "bool":
        return (
          <div className="flex flex-col">
            <label className="mt-4 base-text">{comp.name}</label>
            <Select className="min-w-[8rem]" onChange={(value) => handleArgInputChange(value, index)}>
              <Select.Option value="false">No</Select.Option>
              <Select.Option value="true">Yes</Select.Option>
            </Select>
          </div>
        )
      default:
        return (
          <div className="flex flex-col">
            <label className="mt-4 base-text">{comp.name}</label>
            {/* <TextInput onChange={(e) => handleArgInputChange(e.target.value, index)}></TextInput> */}
            <Input
              onChange={(e) => handleArgInputChange(e.target.value, index)}
              className="h-12 p-3 rounded-6 border-normal dark:border-whiteDark hover:border-primary focus:border-primary dark:placeholder-white/60"
            />
          </div>
        )
    }
  }

  const handleArgInputChange = (value: any, index: number) => {
    setArgValues((prevState) => {
      const nextState = [...prevState]
      nextState[index] = value
      return nextState
    })
  }

  const renderArgInputs = () => {
    const foundEntry = parsedAbi.find((item) => item.name === selectedFunction)
    console.log("Found Entry: ", foundEntry)
    const inputs = []
    foundEntry.inputs.map((item, index) => inputs.push(resolveComponent(item, index)))
    console.log("Inputs: ", inputs)
    setArgInputs(inputs)
    const emptyArr = Array(inputs.length)
    setArgValues(emptyArr)
  }

  useEffect(() => {
    if (selectedFunction === "") {
      setArgInputs([])
      return
    }
    renderArgInputs()
  }, [selectedFunction])

  useEffect(() => {
    console.log("Arg Inputs: ", argInputs)
  }, [argInputs])

  useEffect(() => {
    console.log("Arg Values: ", argValues)
  }, [argValues])

  console.log("isAbiParsed: ", { isAbiParsed })
  console.log("selectedFunction: ", { selectedFunction })
  console.log("argInputs: ", { argInputs })

  const onFinish: FormProps<SimpleTxProps>["onFinish"] = (values) => {
    console.log("Success:", values)
    handleSubmit(values)
  }

  const onFinishFailed: FormProps<SimpleTxProps>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo)
  }

  return (
    <Form
      variant="outlined"
      initialValues={{ ...initialState }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
      disabled={disabled}
      layout="vertical"
    >
      <div className="mt-6 flex flex-col w-full gap-6">
        <div className="flex flex-col">
          <label className="base-text">Gas Order</label>
          <Input
            value={inputValues.gasOrder.toString()}
            onChange={(e) => setInputValues({ ...inputValues, gasOrder: Number(e.target.value) })}
            // error={!!validationErrors?.gasOrder}
            // errorMessage={validationErrors?.gasOrder}
            spellCheck={false}
            placeholder="123"
            size="middle"
            className="h-12 p-3 rounded-6 border-normal dark:border-whiteDark hover:border-primary focus:border-primary dark:placeholder-white/60"
          />
        </div>

        <div className="flex flex-col">
          <label className="base-text mb-1">Execution period End</label>
          <div className="flex flex-col gap-4">
            <DatePicker
              // defaultValue={dayjs().add(1, "d")}
              value={inputValues.deadlineDate}
              presets={[
                {
                  label: "Tommorrow",
                  value: dayjs().add(1, "d"),
                },
                {
                  label: "Next Week",
                  value: dayjs().add(7, "d"),
                },
                {
                  label: "Next Month",
                  value: dayjs().add(1, "month"),
                },
              ]}
              onChange={(date) => {
                if (date) {
                  setInputValues({ ...inputValues, deadlineDate: date })
                }
              }}
            />
            <TimePicker
              className="dark:[&>div>input]:text-white/60 dark:[&>div>.ant-picker-suffix]:text-white/60"
              // defaultValue={dayjs("00:00", "HH:mm")}
              format={"HH:mm"}
              value={inputValues.deadlineTime}
              onChange={(value) => setInputValues({ ...inputValues, deadlineTime: value })}
              // error={!!validationErrors?.executionPeriodEndTime}
              // errorMessage={validationErrors?.executionPeriodEndTime}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="base-text">To</label>
          <Input
            value={inputValues.to}
            onChange={(e) => setInputValues({ ...inputValues, to: e.target.value })}
            placeholder={inputValues.to}
            // error={!!validationErrors?.to}
            // errorMessage={validationErrors?.to}
            spellCheck={false}
            size="middle"
            className="h-12 p-3 rounded-6 border-normal dark:border-whiteDark hover:border-primary focus:border-primary dark:placeholder-white/60"
          />
        </div>

        <div className="flex flex-col">
          <label className="base-text">Gas</label>
          <Input
            value={inputValues.gas.toString()}
            onChange={(e) => setInputValues({ ...inputValues, gas: Number(e.target.value) })}
            // error={!!validationErrors?.gas}
            // errorMessage={validationErrors?.gas}
            spellCheck={false}
            placeholder="123"
            size="middle"
            className="h-12 p-3 rounded-6 border-normal dark:border-whiteDark hover:border-primary focus:border-primary dark:placeholder-white/60"
          />
        </div>

        {isAbiParsed ? null : (
          <div className="flex flex-col">
            <label className="base-text">ABI</label>
            <Input.TextArea
              value={inputValues.userAbi}
              onChange={(e) => {
                e.target.style.height = ""
                e.target.style.height = e.target.scrollHeight + "px"
                setInputValues({ ...inputValues, userAbi: e.target.value })
              }}
              // error={!!validationErrors?.userAbi}
              // errorMessage={validationErrors?.userAbi}
              placeholder="Copy and paste your ABI here"
              spellCheck={false}
              className="border-normal dark:border-whiteDark hover:border-primary focus:border-primary"
            />
          </div>
        )}

        {isAbiParsed ? (
          <div className="flex flex-row old-md:justify-between mt-4">
            <span className="text-primary">Abi was successfully parsed</span>
            <Buttons
              onClick={() => {
                setIsAbiParsed(false)
                setParsedAbi(undefined)
                setInputValues({ ...inputValues, userAbi: "" })
                setArgInputs([])
                setArgValues([])
                setSelectedFunction("")
              }}
              className="secondary_btn"
            >
              {isLoading ? "" : "Clear ABI"}
            </Buttons>
          </div>
        ) : (
          <div className="flex flex-row old-md:justify-end mt-4">
            <Buttons onClick={parseAbi} className="secondary_btn">
              {isLoading ? "" : "Parse ABI"}
            </Buttons>
          </div>
        )}

        {isAbiParsed && (
          <div className="flex flex-col old-lg:flex-row gap-6 mt-4">
            <div className="flex flex-col grow">
              <span className="base-text">Function</span>
              <div className="flex flex-col mt-2">
                <Select value={selectedFunction} onChange={setSelectedFunction}>
                  {parsedAbi
                    .filter((item) => item.type === "function")
                    .map((item, index) => {
                      return <Select.Option value={item.name}>{item.name}</Select.Option>
                    })}
                </Select>
              </div>
            </div>
          </div>
        )}

        {isAbiParsed && selectedFunction && argInputs.length !== 0 && (
          <div className="mt-8 flex flex-col">
            <span className="base-text">Function Arguments</span>
            {argInputs}
          </div>
        )}

        {isAbiParsed && (
          <div className="flex flex-row old-md:justify-end mt-4">
            <Buttons onClick={handleSubmit} className="primary_btn">
              {"Submit"}
            </Buttons>
          </div>
        )}
      </div>
    </Form>
  )
}
