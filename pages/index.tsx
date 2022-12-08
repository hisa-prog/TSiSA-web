import type { NextPage } from "next";
import React, { useState } from "react";

const Home: NextPage = () => {
  const [step, setStep] = useState(0);

  const [numOfObjects, setNumOfObjects] = useState(5);
  const handleInputNumOfObjects = (e: any) => {
    setNumOfObjects(e.target.value);
  };

  const [objects, setObjects] = useState<Array<string>>([]);
  const addObject = (value: any) => {
    let temp = [...objects];
    temp.push(value);
    setObjects(temp);
  };

  const [numOfCriteries, setNumOfCriteries] = useState(2);
  const handleInputNumOfCriteries = (e: any) => {
    setNumOfCriteries(e.target.value);
  };

  const [criteries, setCriteries] = useState<Array<string>>([]);
  const addCriteriy = (value: any) => {
    let temp = [...criteries];
    temp.push(value);
    setCriteries(temp);
  };

  const [stepOfCriteriy, setStepOfCriteriy] = useState(0)
  const [lp, setLp] = useState<Array<Array<string>>>([])
  const addLp = (value: any[]) => {
    let temp = [...lp]
    temp.push(value)
    setLp(temp)
    if(stepOfCriteriy != criteries.length - 1) setStepOfCriteriy(stepOfCriteriy + 1)
  }

  const [numOfScale, setNumOfScale] = useState(0);
  const handleInputNumOfScale = (e: any) => {
    setNumOfScale(e.target.value);
  };

  const [numOfScaleStep, setNumOfScaleStep] = useState(0);
  const handleInputNumOfScaleStep = (e: any) => {
    setNumOfScaleStep(e.target.value);
  };

  const [funcTables, setFuncTables] = useState<Array<Array<Array<number>>>>([])
  const [isFullFuncTables, setIsFullFuncTables] = useState(false)

  const addLimitInTable = (inputLimit : any, value : any, tableIndex : any, elLPIndex : any) => {
    // console.log(inputLimit, value, tableIndex, elLPIndex)
    let limit = inputLimit / 5
    let temp = funcTables.slice()
    let tempTable = temp[tableIndex].slice()
    let tempLP = temp[tableIndex][elLPIndex].slice()
    tempLP[limit] = value
    temp[tableIndex] = tempTable
    temp[tableIndex][elLPIndex] = tempLP
    // console.log(temp)
    setFuncTables(temp)
  }

  const fillTable = () => {
    let temp = funcTables.slice()

    //Для первой строки
    temp.map((item, index) => {
      let temp1 = item[0].slice()
      let i = 0;
      while(temp1[i] === 0) {
        temp1[i] = 1
        i++
      }
      item[0] = temp1
    })

    //Для строки посередине
    temp.map((item, index) => {
      let temp1 = item[1].slice()

      let i = 0;
      while(temp1[i] === 0) {
        temp1[i] = -1
        i++
      }

      let j = temp1.length - 1
      while(temp1[j] === 0) {
        temp1[j] = -1
        j--
      }

      for (let z = 0; z <= temp1.length - 1; z++) {
        if(temp1[z] === 0) temp1[z] = 1
        else if(temp1[z] === -1) temp1[z] = 0
      }

      item[1] = temp1
    })

    //Для последней строки
    temp.map((item, index) => {
      let temp1 = item[2].slice()
      let i = temp1.length - 1;
      while(temp1[i] === 0) {
        temp1[i] = 1
        i--
      }
      item[2] = temp1
    })

    setFuncTables(temp)
  }

  const [valuesTables, setValuesTables] = useState<Array<Array<any>>>([])
  const [stepOfValues, setStepOfValues] = useState(0)
  const [resultsValuesTables, setResultsValuesTables] = useState<Array<Array<Array<any>>>>([])

  const getCompressTables = () => {

    let limits: Array<any> = []
    Array(numOfScale/numOfScaleStep + 1).fill(0).map((item, index) => limits.push(index * 5))
    let finalArray = resultsValuesTables.slice()

    {valuesTables.map((valuesEl, valuesElIndex) => {

      //низкое
      let results1: Array<any> = []
      let line = funcTables[valuesElIndex][0].slice()
      let ogr: Array<any> = []
      line.map((item, index) => {
        if(+item !== 0 && +item != 1) ogr.push(index)
      })
      let orguments = [ogr[0] - 1, ...ogr, ogr[ogr.length - 1] + 1]

      valuesEl.map((value, index) => {
        if(value < limits[orguments[0]]) return results1.push(1)
        for (let i = 1; i <= orguments.length - 1; i++) {
          if(value <= limits[orguments[i]]) {
            // console.log(value, limits[orguments[i]])
            let res = (((line[orguments[i]] - line[orguments[i - 1]]) / (limits[orguments[i]] - limits[orguments[i-1]])) * value + (limits[orguments[i]] * line[orguments[i-1]] - limits[orguments[i-1]] * line[orguments[i]]) / (limits[orguments[i]] - limits[orguments[i-1]])).toFixed(2)
            return results1.push(+res)
          }
        }
        if(value > limits[orguments[orguments.length - 1]]) return results1.push(0)
      })

      //среднее
      let results2: Array<any> = []
      let line2 = funcTables[valuesElIndex][1].slice()
      let ogr2: Array<any> = []
      line2.map((item, index) => {
        if(+item !== 0 && +item != 1) ogr2.push(index)
      })
      let argTemp1 = [ogr2[0] - 1, ...ogr2.slice(0, (ogr2.length) / 2), ogr2[ogr2.length / 2 - 1] + 1]
      let argTemp2 = [ogr2[(ogr2.length) / 2] - 1, ...ogr2.slice((ogr2.length) / 2, ogr2.length), ogr2[ogr2.length - 1] + 1]

      valuesEl.map((value, index) => {
        if(value <= limits[argTemp1[0]]) return results2.push(0)
        for (let i = 1; i <= argTemp1.length - 1; i++) {
          if(value <= limits[argTemp1[i]]) {
            // console.log(value, limits[argTemp1[i]])
            let res2 = (((line2[argTemp1[i]] - line2[argTemp1[i - 1]]) / (limits[argTemp1[i]] - limits[argTemp1[i-1]])) * value + (limits[argTemp1[i]] * line2[argTemp1[i-1]] - limits[argTemp1[i-1]] * line2[argTemp1[i]]) / (limits[argTemp1[i]] - limits[argTemp1[i-1]])).toFixed(2)
            if (+res2 > 0) return results2.push(+res2)
          }
        }
        if(value <= limits[argTemp2[0]]) return results2.push(1)
        for (let j = 1; j <= argTemp2.length - 1; j++) {
          if(value <= limits[argTemp2[j]]) {
            let res2 = (((line2[argTemp2[j]] - line2[argTemp2[j - 1]]) / (limits[argTemp2[j]] - limits[argTemp2[j-1]])) * value + (limits[argTemp2[j]] * line2[argTemp2[j-1]] - limits[argTemp2[j-1]] * line2[argTemp2[j]]) / (limits[argTemp2[j]] - limits[argTemp2[j-1]])).toFixed(2)
            // console.log(value, limits[argTemp2[j]], res2)
            return results2.push(+res2)
          }
        }
        if(value > limits[argTemp2[argTemp2.length - 1]]) return results2.push(0)
      })

      //высокое
      let results3: Array<any> = []
      let line3 = funcTables[valuesElIndex][2].slice()
      let ogr3: Array<any> = []
      line3.map((item, index) => {
        if(+item !== 0 && +item != 1) ogr3.push(index)
      })
      let orguments3 = [ogr3[0] - 1, ...ogr3, ogr3[ogr3.length - 1] + 1]

      valuesEl.map((value, index) => {
        if(value < limits[orguments3[0]]) return results3.push(0)
        for (let i = 1; i <= orguments3.length - 1; i++) {
          if(value <= limits[orguments3[i]]) {
            // console.log(value, limits[orguments3[i]])
            let res3 = (((line3[orguments3[i]] - line3[orguments3[i - 1]]) / (limits[orguments3[i]] - limits[orguments3[i-1]])) * value + (limits[orguments3[i]] * line3[orguments3[i-1]] - limits[orguments3[i-1]] * line3[orguments3[i]]) / (limits[orguments3[i]] - limits[orguments3[i-1]])).toFixed(2)
            return results3.push(+res3)
          }
        }
        if(value > limits[orguments3[orguments3.length - 1]]) return results3.push(1)
      })

      let finalResult = [results1.slice(), results2.slice(), results3.slice()]
      finalArray.push(finalResult)
      // console.log('final #', valuesElIndex, ': ', finalResult)
    })}

    setResultsValuesTables(finalArray)

  }
  
  const [finalTable, setFinalTable] = useState<Array<Array<any>>>([])
  const [isNegativeTable, setIsNegativeTable] = useState(true)

  const getFinalTable = () => {
    const temp = resultsValuesTables.slice()
    let tempLow = []
    let tempMedium = []
    let tempHigh = []

    for(let i = 0; i < numOfObjects; i++) {
      if(isNegativeTable){
        tempLow.push(Math.max(
          Math.min(temp[0][1][i],temp[1][2][i]), 
          Math.min(temp[0][0][i], temp[1][1][i]),
          Math.min(temp[0][0][i],temp[1][2][i])
        ))
        
        tempMedium.push(Math.max(
          Math.min(temp[0][2][i],temp[1][2][i]), 
          Math.min(temp[0][1][i], temp[1][1][i]),
          Math.min(temp[0][0][i],temp[1][0][i])
        ))
  
        tempHigh.push(Math.max(
          Math.min(temp[0][2][i],temp[1][0][i]), 
          Math.min(temp[0][2][i], temp[1][1][i]),
          Math.min(temp[0][1][i],temp[1][0][i])
        ))
      } else {
        tempLow.push(Math.max(
          Math.min(temp[0][0][i],temp[1][0][i]), 
          Math.min(temp[0][0][i], temp[1][1][i]),
          Math.min(temp[0][1][i],temp[1][0][i])
        ))
        
        tempMedium.push(Math.max(
          Math.min(temp[0][0][i],temp[1][2][i]), 
          Math.min(temp[0][1][i], temp[1][1][i]),
          Math.min(temp[0][2][i],temp[1][0][i])
        ))
  
        tempHigh.push(Math.max(
          Math.min(temp[0][2][i],temp[1][2][i]), 
          Math.min(temp[0][2][i], temp[1][1][i]),
          Math.min(temp[0][1][i],temp[1][2][i])
        ))
      }
      
    }

    setFinalTable([tempLow, tempMedium, tempHigh])
  }

  const lps = ['Низкая', 'Средняя', 'Высокая']
  const [finalLine, setFinalLine] = useState<Array<any>>([])
  const [bestObj, setBestObject] = useState<any>()

  const getFinalLine = () => {
    if(finalTable && finalLine.length === 0) {
      let temp = finalLine.slice()
      for(let i = 0; i < numOfObjects; i++) {
        temp.push((finalTable[0][i] * 0.1 + finalTable[1][i] * 0.5 + finalTable[2][i] * 0.9).toFixed(2))
      }
      setFinalLine(temp)
    }
  }

  const getBestObj = () => {
    let temp = 0
    finalLine.map((el, index) => {
      if(el > temp) temp = index
    })
    setBestObject(temp)
  }

  return (
    <>
      <div className="w-screen h-screen bg-home bg-no-repeat bg-cover flex justify-center items-center ">
        <div className="bg-[rgb(50,42,127)]/40 backdrop-blur-sm w-max h-max rounded-lg p-8">
          {step === 0 ? (
            <div className="flex flex-col justify-center">
              <p className="text-white text-4xl text-center">
                Выберите кол-во альтернатив
              </p>
              <p className="text-white/40 text-2xl text-left">
                Ограничение: не меньше 5-ти альтернатив
              </p>
              <input
                value={numOfObjects}
                onChange={handleInputNumOfObjects}
                type="number"
                min="5"
                placeholder="5"
                className="rounded-lg bg-black/50 outline-none mt-4 text-3xl font-normal text-white w-24 p-2"
              />
              <button
                className={`${
                  numOfObjects >= 5
                    ? "text-white cursor-pointer"
                    : "text-white/40"
                } mt-4 rounded-md w-max py-1 px-10 self-center bg-black/50 text-2xl`}
                disabled={numOfObjects < 5}
                onClick={() => {
                  numOfObjects >= 5 && setStep(step + 1);
                }}
              >
                Перейти к следующему шагу
              </button>

              {/* <button
                className={`text-white cursor-pointer mt-4 rounded-md w-max py-1 px-10 self-center bg-black/50 text-2xl`}
                onClick={() => {
                  setNumOfObjects(5)
                  setObjects([
                    "ассортимент поставщика",
                    "скорость доставки комплектующих от поставщика", 
                    "качество комплектующих", 
                    "надежность поставщика", 
                    "цена комплектующих"]
                  )
                  setNumOfCriteries(2)
                  setCriteries([
                    "Качество предоставляемых услуг",
                    "Затраты на осуществление услуг"]
                  )
                  setLp([["Неудовлетворительно", "Среднее", "Хорошее"], ["Низкие", "Умеренные", "Высокие"]])
                  setNumOfScale(100)
                  setNumOfScaleStep(5)
                  setFuncTables([
                    [
                      [1,1,1,1,1,1,0.86,0.6,0.29,0,0,0,0,0,0,0,0,0,0,0,0],
                      [0,0,0,0,0,0,0.18,0.46,0.74,1,1,1,1,0.79,0.38,0.12,0,0,0,0,0],
                      [0,0,0,0,0,0,0,0,0,0,0,0,0,0.24,0.54,0.76,1,1,1,1,1],
                    ],
                    [
                      [1,1,0.76,0.39,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                      [0,0,0.42,0.86,1,0.80,0.29,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                      [0,0,0,0,0,0.18,0.74,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    ]
                  ])
                  setValuesTables([
                    ["75", "40", "90", "65", "50"], 
                    ["30", "10", "20", "5", "15"]
                  ])
                  setStepOfValues(1)
                  // getCompressTables()
                  setStep(7);
                }}
              >
                Ввести моковые данные
              </button> */}
            </div>
          ) : step === 1 ? (
            <div className="flex flex-col justify-center">
              <p className="text-white text-4xl text-center">
                Введите альтернативы
              </p>

              <div className="flex flex-col">
                <div className="flex items-center">
                  <input
                    id={"objects"}
                    placeholder={"Альтернатива"}
                    type="text"
                    className="rounded-lg bg-black/50 outline-none mt-4 text-lg font-normal w-full text-white p-2 placeholder:text-white/40"
                  />
                  <button
                    className={`${
                      objects.length != numOfObjects
                        ? "text-white cursor-pointer"
                        : "text-white/40"
                    } ml-4 mt-4 rounded-md w-max py-2 px-10 bg-black/50 text-lg`}
                    disabled={objects.length === numOfObjects}
                    onClick={() => { //@ts-ignore
                      let inputValue = document?.getElementById("objects")?.value;
                      if (!inputValue)
                        alert("Вы не можете добавить пустое поле");
                      else if (objects.find((item) => item === inputValue))
                        alert("Такая альтернатива уже добавлена");
                      else if (objects.length === numOfObjects)
                        alert("Вы уже добавили все альтернативы");
                      else {
                        addObject(inputValue);
                      }
                    }}
                  >
                    Добавить
                  </button> {/* @ts-ignore */}
                  <button onClick={() => document.getElementById("objects").value = ''}
                  className='ml-4 mt-4 rounded-md w-max py-2 px-10 bg-black/50 text-lg text-white cursor-pointer'
                  >Очистить</button>
                </div>

                <p className="text-white text-4xl text-center mt-4">
                  Введеные альтернативы
                </p>

                {objects.length != 0 ? (
                  <div className="flex flex-col border border-white/40 w-max mt-4 rounded-lg">
                    {objects.map((item, index) => (
                      <div key={index} className="flex items-center border-b last:border-b-0 border-white/40">
                        <p className="text-white text-lg text-center p-4 w-16 border-r border-white/40">
                          {"u" + (index + 1)}
                        </p>
                        <p className="text-white text-lg text-center p-4">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <img
                    src={"images/loader.png"}
                    alt="loader"
                    className="animate-spinLoader w-16 mt-4 self-center"
                  />
                )}
              </div>

              <button
                className={`${
                  objects.length === numOfObjects
                    ? "text-white cursor-pointer"
                    : "text-white/40"
                } mt-4 rounded-md w-max py-1 px-10 self-center bg-black/50 text-2xl`}
                disabled={objects.length != numOfObjects}
                onClick={() => {
                  objects.length === numOfObjects && setStep(step + 2);
                }}
              >
                Перейти к следующему шагу
              </button>
            </div>
          ) : step === 2 ? (
            <div className="flex flex-col justify-center">
              <p className="text-white text-4xl text-center">
                Выберите кол-во критериев
              </p>
              <p className="text-white/40 text-2xl text-left">
                Ограничение: не меньше 2-х критериев
              </p>
              <input
                value={numOfCriteries}
                onChange={handleInputNumOfCriteries}
                type="number"
                min="2"
                placeholder="2"
                className="rounded-lg bg-black/50 outline-none mt-4 text-3xl font-normal text-white w-24 p-2"
              />
              <button
                className={`${
                  numOfCriteries >= 2
                    ? "text-white cursor-pointer"
                    : "text-white/40"
                } mt-4 rounded-md w-max py-1 px-10 self-center bg-black/50 text-2xl`}
                disabled={numOfCriteries < 2}
                onClick={() => {
                  numOfCriteries >= 2 && setStep(step + 1);
                }}
              >
                Перейти к следующему шагу
              </button>
            </div>
          ) : step === 3 ? (
            <div className="flex flex-col justify-center">
              <p className="text-white text-4xl text-center">
                Введите 2 критерия
              </p>

              <div className="flex flex-col">
                <div className="flex items-center">
                  <input
                    id={"criteries"}
                    placeholder={"Критерий"}
                    type="text"
                    className="rounded-lg bg-black/50 outline-none mt-4 text-lg font-normal w-full text-white p-2 placeholder:text-white/40"
                  />
                  <button
                    className={`${
                      criteries.length != numOfCriteries
                        ? "text-white cursor-pointer"
                        : "text-white/40"
                    } ml-4 mt-4 rounded-md w-max py-2 px-10 bg-black/50 text-lg`}
                    disabled={criteries.length === numOfCriteries}
                    onClick={() => { //@ts-ignore
                      let inputValue = document?.getElementById("criteries")?.value;
                      if (!inputValue)
                        alert("Вы не можете добавить пустое поле");
                      else if (criteries.find((item) => item === inputValue))
                        alert("Такой критерий уже добавлен");
                      else if (criteries.length === numOfCriteries)
                        alert("Вы уже добавили все критерии");
                      else addCriteriy(inputValue)
                    }}
                  >
                    Добавить
                  </button>{/* @ts-ignore */}
                  <button onClick={() => document.getElementById("criteries").value = ''}
                  className='ml-4 mt-4 rounded-md w-max py-2 px-10 bg-black/50 text-lg text-white cursor-pointer'
                  >Очистить</button>
                </div>

                <p className="text-white text-4xl text-center mt-4">
                  Введеные критерии
                </p>

                {criteries.length != 0 ? (
                  <div className="flex flex-col border border-white/40 w-max mt-4 rounded-lg">
                    {criteries.map((item, index) => (
                      <div key={index} className="flex items-center border-b last:border-b-0 border-white/40">
                        <p className="text-white text-lg text-center p-4 w-16 border-r border-white/40">
                          {"K" + (index + 1)}
                        </p>
                        <p className="text-white text-lg text-center p-4">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <img
                    src={"images/loader.png"}
                    alt="loader"
                    className="animate-spinLoader w-16 mt-4 self-center"
                  />
                )}
              </div>

              <button
                className={`${
                  criteries.length === numOfCriteries
                    ? "text-white cursor-pointer"
                    : "text-white/40"
                } mt-4 rounded-md w-max py-1 px-10 self-center bg-black/50 text-2xl`}
                disabled={criteries.length != numOfCriteries}
                onClick={() => {
                  criteries.length === numOfCriteries && setStep(step + 1);
                }}
              >
                Перейти к следующему шагу
              </button>
            </div>
          ) : step === 4 ? (
            <div className="flex flex-col justify-center">
              {criteries.map((item, index) => (
                <div key={index} className={`${index === stepOfCriteriy ? 'flex' : 'hidden'} flex-col justify-center`}>
                  <p className="text-white text-4xl text-center">
                    Введите лингвистические переменные для K{index+1} через пробелы
                  </p>
                  <div className="flex items-center">
                    <input
                      id={"lp" + index}
                      placeholder={"Неудовлетворительно Умеренно Хорошо"}
                      type="text"
                      className="rounded-lg bg-black/50 outline-none mt-4 text-lg font-normal w-full text-white p-2 placeholder:text-white/40"
                    />
                    <button
                      className={`${
                        lp.length != criteries.length
                          ? "text-white cursor-pointer"
                          : "text-white/40"
                      } ml-4 mt-4 rounded-md w-max py-2 px-10 bg-black/50 text-lg`}
                      disabled={lp.length === criteries.length}
                      onClick={() => { //@ts-ignore
                        let inputValue = document?.getElementById("lp" + index)?.value;
                        if (!inputValue)
                          alert("Вы не можете добавить пустое поле");
                        else if (lp.length === criteries.length)
                          alert("Вы уже добавили все лингвистические переменные");
                        else addLp(inputValue.split(' '))
                      }}
                    >
                      Добавить
                    </button>{/* @ts-ignore */}
                    <button onClick={() => document.getElementById("lp" + index).value = ''}
                    className='ml-4 mt-4 rounded-md w-max py-2 px-10 bg-black/50 text-lg text-white cursor-pointer'
                    >Очистить</button>
                  </div>
                </div>
              ))}

              <p className="text-white text-4xl text-center mt-4">
                Введеные ЛП
              </p>


              <div className="mt-4 flex justify-around">
                {criteries.map((item, index) => (
                  <div key={index} className="flex flex-col justify-center m-4 border border-white/40">
                    <p className="text-white text-lg text-center border-b border-white/40 py-2 px-8">{item}</p> {/* @ts-ignore */}
                    {lp[index] ? lp[index].map((el, elIndex) => (
                      <p key={elIndex} className="text-white text-lg border-b border-white/40 last:border-b-0 py-2 px-8">{el}</p>
                    )) : (
                      <img
                        src={"images/loader.png"}
                        alt="loader"
                        className="animate-spinLoader w-8 my-4 self-center"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                className={`${
                  lp.length === criteries.length
                    ? "text-white cursor-pointer"
                    : "text-white/40"
                } mt-4 rounded-md w-max py-1 px-10 self-center bg-black/50 text-2xl`}
                disabled={lp.length != criteries.length}
                onClick={() => {
                  lp.length === criteries.length && setStep(step + 1);
                }}
              >
                Перейти к следующему шагу
              </button>
            </div>
          ) : step === 5 ? (
            <div className="flex flex-col justify-center">
              <p className="text-white text-4xl text-center">
                Выберите максимальное значение балльной шкалы
              </p>
              <p className="text-white/40 text-2xl text-left">
                Например, 100 балльная шкала
              </p>
              <input
                value={numOfScale}
                onChange={handleInputNumOfScale}
                type="number"
                placeholder="100"
                className="rounded-lg bg-black/50 outline-none mt-4 text-3xl font-normal text-white w-24 p-2"
              />
              <p className="text-white text-4xl text-center">
                Выберите шаг
              </p>
              <p className="text-white/40 text-2xl text-left">
                Например, 5
              </p>
              <input
                value={numOfScaleStep}
                onChange={handleInputNumOfScaleStep}
                type="number"
                placeholder="5"
                className="rounded-lg bg-black/50 outline-none mt-4 text-3xl font-normal text-white w-24 p-2"
              />
              <button
                className={`${
                  numOfScale !== 0 && numOfScaleStep !== 0
                    ? "text-white cursor-pointer"
                    : "text-white/40"
                } mt-4 rounded-md w-max py-1 px-10 self-center bg-black/50 text-2xl`}
                disabled={numOfScale === 0 || numOfScaleStep === 0}
                onClick={() => {
                  if(numOfScale !== 0 && numOfScaleStep !== 0) {
                    setStep(step + 1);
                    setFuncTables(new Array(numOfCriteries).fill(new Array(3).fill(new Array(numOfScale/numOfScaleStep + 1).fill(0))))
                  }
                }}
              >
                Перейти к следующему шагу
              </button>
            </div>
          ) : step === 6 ? (
            <div className="flex flex-col justify-center">

              <p className="text-white text-4xl text-center my-4">
                Введите ограничения для 3-х переменных критерия
              </p>
              <div className="flex flex-col h-[14vh] overflow-y-scroll">
              {funcTables.map((table, tableIndex) => (
                <div key={tableIndex} className="flex flex-col">
                  <p className="text-lg text-white my-1">{criteries[tableIndex]} (дробные значения прописывать через точку)</p>
                  <div className="flex flex-col">
                    {lp[tableIndex].map((elLP, elLPIndex) => (
                      <div key={elLPIndex} className="flex items-center">
                        <p className="text-white mr-1">Ограничение:</p>
                        <input
                          id={'limitIndex' + tableIndex + elLPIndex}
                          placeholder="0"
                          className="rounded-lg bg-black/50 outline-none mt-1 text-base font-normal text-white w-16 p-1 mr-2"
                        />
                        <p className="text-white mr-1">Значение:</p>
                        <input
                          id={'limit' + tableIndex + elLPIndex}
                          placeholder="0"
                          className="rounded-lg bg-black/50 outline-none mt-1 text-base font-normal text-white w-16 p-1 mr-2"
                        />
                        <button
                          className={`text-white cursor-pointer mt-1 rounded-md w-max py-1 px-2 self-center bg-black/50 text-base`}
                          onClick={() => { //@ts-ignore
                            let inputLimit = document?.getElementById('limitIndex' + tableIndex + elLPIndex)?.value //@ts-ignore
                            let inputLimitValue = document?.getElementById('limit' + tableIndex + elLPIndex)?.value
                            if(inputLimitValue === 0 || (inputLimit < 0 && inputLimit > numOfScale)) alert("Вы не можете добавить пустое поле или 0");
                            else if (inputLimitValue === 1) alert("Вы не можете добавить 1");
                            else if (inputLimit < 0 && inputLimit > numOfScale) alert("Такого диапазона не существует")
                            else  {
                              addLimitInTable(inputLimit, inputLimitValue, tableIndex, elLPIndex)
                            }
                          }}
                        >
                          Добавить ограничение для {lp[tableIndex][elLPIndex]}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              </div>

              <p className="text-white text-4xl text-center my-4">
                Таблицы критериев
              </p>
              <div className="flex flex-col h-[16vh] overflow-y-scroll mt-4">
              {funcTables.map((table, tableIndex) => (
                <div key={tableIndex} className="mx-4 border-4 rounded-sm border-white/40 mb-4 last:mb-0">
                  <p className="text-xl text-white text-center p-2">{criteries[tableIndex]}</p>
                  <div className="flex border-t-4 border-white/40">
                    {/* граница слева */}
                    <div className="flex flex-col border-r-4 border-white/40">
                      <p className="text-center border-b-4 border-white/40 text-white px-2 py-0-5">x ∈ X</p>
                      {lp[tableIndex].map((item, index) => (
                        <p key={index} className="px-2 py-0-5 border-b-4 last:border-b-0 border-white/40 text-white w-56">u {item} (x)</p>
                      ))}
                    </div>
                    {/* Заполненная таблица */}
                    <div style={{"gridTemplateColumns" : `repeat(${numOfScale/numOfScaleStep + 1}, 1fr)`}} className={`grid w-full`}>
                        {Array(numOfScale/numOfScaleStep + 1).fill(0).map((item, index) => (
                          <p key={index} className={`${index + 1 !== (numOfScale/numOfScaleStep + 1) && 'border-r-4'} 
                          col-span-1 border-b-4 border-white/40 text-white px-1 py-0-5 text-center`}>{index * 5}</p>
                        ))}
                        {table.map((elU, elUIndex) => (
                          <>
                            {elU.map((value, valueIndex) => (
                              <p key={valueIndex} className={`${valueIndex + 1 !== (numOfScale/numOfScaleStep + 1) && 'border-r-4'}
                              ${elUIndex !== 2 && 'border-b-4'}
                              col-span-1 border-white/40 text-white px-1 py-0-5 text-center`}>{value}</p>
                            ))}
                          </>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
              </div>

              <button
                className={`text-white cursor-pointer mt-4 rounded-md w-max py-1 px-10 self-center bg-black/50 text-2xl`}
                onClick={() => {
                  fillTable()
                  setIsFullFuncTables(true)
                }}
              >
                Заполнить остальные поля
              </button>

              <button
                className={`${
                  isFullFuncTables
                    ? "text-white cursor-pointer"
                    : "text-white/40"
                } mt-4 rounded-md w-max py-1 px-10 self-center bg-black/50 text-2xl`}
                disabled={!isFullFuncTables}
                onClick={() => {
                  if(isFullFuncTables) {
                    setStep(step + 1);
                  }
                }}
              >
                Перейти к следующему шагу
              </button>

            </div>
          ) : step === 7 ? (
            <div className="flex flex-col">
              {criteries.map((table, tableInd) => (
                <>
                  <div className={`${tableInd !== stepOfValues && 'hidden'} flex flex-col`}>
                    <p className="text-white text-4xl text-center my-4">
                      Введите значения для альтернатив критерия {tableInd + 1}
                    </p>
                    <p className="text-lg text-white/40">
                      Балльная шкала: {numOfScale}, Шаг: {numOfScaleStep}
                    </p>
                  
                    <div className="flex flex-col mt-4">
                      <p className="text-center text-white text-xl">{table}</p>
                      {objects.map((object, objectInd) => (
                          <div key={objectInd} className="flex items-center">
                            <p className="text-white py-1">{object}</p>
                            <input
                              id={'valueTable' + tableInd + objectInd}
                              min='0'
                              max={numOfScale}
                              step={'5'}
                              type='number'
                              placeholder="0"
                              className="rounded-lg bg-black/50 outline-none ml-2 mt-1 text-base font-normal text-white w-16 p-1 mr-2"
                            />
                          </div>
                      ))}
                    </div>

                    <button className={`${valuesTables.length === numOfCriteries && 'hidden'} text-white cursor-pointer
                    mt-4 rounded-md w-max py-1 px-2 self-center bg-black/50 text-base`}
                    onClick={() => {
                      let temp = []
                      for (let i = 0; i < numOfObjects; i++) { //@ts-ignore
                        const tempInput = document?.getElementById('valueTable' + tableInd + i)?.value
                        if(tempInput === null || tempInput === undefined || tempInput === '') return alert('Вы не можете внести пустые значения')
                        else if(+tempInput % numOfScaleStep != 0) return alert('Введите значения с правильным шагом')
                        else if(+tempInput < 0 || +tempInput > numOfScale) return alert('Значения выходят за границы шкалы')
                        else temp.push(tempInput)
                      }
                      
                      let tempArray = valuesTables.slice()
                      tempArray[tableInd] = temp
                      setValuesTables(tempArray)
                      if(stepOfValues != numOfCriteries - 1) setStepOfValues(stepOfValues + 1)
                    }}>
                      {stepOfValues === numOfCriteries - 1 ? 'Заполнить значения' : 'Перейти к заполнению значений следующего критерия'} 
                    </button>

                    <button className={`${valuesTables.length !== numOfCriteries && 'hidden'} text-white cursor-pointer
                      mt-4 rounded-md w-max py-1 px-2 self-center bg-black/50 text-base`}
                      onClick={() => {
                        setStep(step + 1)
                        getCompressTables()
                    }}>
                      Перейти к просмотру расчёта таблиц
                    </button>
                  </div>
                </>
              ))}
            </div>
          ) : step === 8 ? (
            <div className="flex flex-col">
              <div className="flex items-center">
                    {valuesTables.map((tableValues, tableValuesInd) => (
                      <div key={tableValuesInd} className="flex flex-col mr-8 last:mr-0 border-2 border-white/40 rounded-lg">
                        <p className="text-lg text-white text-center p-2 border-b-2 border-white/40">{criteries[tableValuesInd]}</p>
                        <div className="flex">
                          <div className="flex flex-col border-r-2 border-white/40">
                            <p className="text-lg border-b-2 p-2 border-white/40 text-center text-transparent">*</p>
                            <p className="text-white text-lg border-b-2 p-2 border-white/40">Альтернативы</p>
                            {objects?.map((obj, objIndex) => (
                              <p key={objIndex} className="text-center text-white text-lg border-b-2 last:border-b-0 p-2 border-white/40">u{objIndex + 1}</p>
                            ))}
                          </div>
                          <div className="flex flex-col border-r-2 border-white/40">
                          <p className="text-lg border-b-2 p-2 border-white/40 text-center text-transparent">*</p>
                          <p className="text-white text-lg border-b-2 p-2 border-white/40">Значения</p>
                            {tableValues?.map((el, elIndex) => (
                              <p key={elIndex} className="text-center text-lg text-white border-b-2 last:border-b-0 p-2 border-white/40">{el}</p>
                              ))}
                          </div>
                          <div className="grid grid-cols-3">
                            <p className="text-white text-lg border-b-2 p-2 border-white/40 col-span-full text-center">Нечеткие значения</p>
                            {lp[tableValuesInd].map((elLp, elLpIndex) => (
                                  <p key={elLpIndex} className="col-span-1 text-center text-white text-lg border-b-2 border-r-2 p-2 border-white/40">{elLp}</p>
                            ))}
                            {resultsValuesTables[tableValuesInd].map((result, resultInd) => (
                              <div key={resultInd} className="col-span-1 border-r-2 last:border-r-0 border-white/40">
                                {result.map((elRes, elResInd) => (
                                  <div key={elResInd} className="text-center text-lg text-white border-b-2 last:border-b-0 p-2 border-white/40">{elRes}</div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
              <button className={`text-white cursor-pointer
                mt-4 rounded-md w-max py-1 px-2 self-center bg-black/50 text-base`}
                onClick={() => {
                setStep(step + 1)
                }}>
                Перейти к следующему шагу
              </button>
            </div>
          ) : step === 9 && (
            <div className='flex flex-col'>
              <p className="text-white text-4xl text-center">
                Общий критерий
              </p>
              <div className="flex items-center mt-4">
                <p className="text-white text-lg">{`Во 2-м критерии значения 'Низкие' это наилучшие значения?`}</p>
                <div onClick={() => setIsNegativeTable(!isNegativeTable)}
                className={`${isNegativeTable ? 'bg-blue-700' : 'bg-transparent'} 
                transition-all duration-500 w-4 h-4 border rounded-sm ml-2 cursor-pointer`}></div>
              </div>
              <button className={`text-white cursor-pointer
                mt-4 rounded-md w-max py-1 px-2 bg-black/50 text-base`}
                onClick={() => {
                  getFinalTable()
                }}>
                Рассчитать и выразить в таблицу
              </button>
              <button className={`${finalTable.length === 0 ? 'text-white/40' : 'text-white cursor-pointer'} 
                mt-4 rounded-md w-max py-1 px-2 bg-black/50 text-base`}
                disabled={finalTable.length === 0}
                onClick={() => {
                  getFinalLine()
                }}>
                Рассчитать значения альтернатив
              </button>
              <button className={`${finalLine.length === 0 ? 'text-white/40' : 'text-white cursor-pointer'} 
                mt-4 rounded-md w-max py-1 px-2 bg-black/50 text-base`}
                disabled={finalLine.length === 0}
                onClick={() => {
                  getBestObj()
                }}>
                Рассчитать наилучшую альтернативу
              </button>
              {finalTable && (
                <div className="flex flex-col">
                  <p className="text-white text-4xl text-center mt-4">
                   Общая таблица
                  </p>
                  <div className="flex">
                    <div className="flex border-2 border-white/40 mt-4 rounded-md">
                      <div className="flex flex-col border-r-2 border-white/40">
                        <p className="text-white text-lg border-b-2 last:border-b-0 border-white/40 p-2 text-center">Объекты</p>
                        {objects.map((obj, objInd) => (
                          <p key={objInd} className="text-white text-lg border-b-2 last:border-b-0 border-white/40 p-2">{obj}</p>
                        ))}
                      </div>
                      {finalTable.map((el, elInd) => (
                        <div key={elInd} className="flex flex-col">
                          <p className={`${elInd != 2 && 'border-r-2'} text-white text-lg border-b-2  
                          last:border-b-0 border-white/40 p-2 text-center`}>{lps[elInd]}</p>
                          <div className="flex flex-col border-r-2 last:border-r-0 border-white/40">
                            {el.map((item, index) => (
                              <p key={index} className={`
                              text-white text-lg text-center border-b-2 last:border-b-0 border-r-2 border-white/40 p-2`}>{item}</p>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col border-2 border-white/40 mt-4 rounded-md ml-4">
                      <p className="text-white text-lg border-b-2 last:border-b-0 border-white/40 p-2 text-center">Значения альтернатив</p>
                      <div className="flex flex-col">
                      {finalLine.map((el, elIndex) => (
                        <p key={elIndex} className="text-white text-lg text-center p-2 border-b-2 last:border-b-0 border-white/40">{el}</p>
                      ))}
                      </div>
                    </div>

                  </div>
                    <div className="flex flex-col border-2 border-white/40 mt-4 rounded-md">
                      <p className="text-white text-lg border-b-2 last:border-b-0 border-white/40 p-2 text-center">Значение наилучшей альтернативы </p>
                      <div className="flex flex-col">
                        {bestObj && 
                        <p className="text-white text-lg text-center p-2 border-b-2 last:border-b-0 border-white/40">
                          {objects[bestObj] + ' : ' + finalLine[bestObj]}
                        </p>
                        }
                      </div>
                    </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
