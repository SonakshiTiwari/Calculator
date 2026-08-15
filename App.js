import {useReducer} from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import "./style.css"

export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate'
}

function reducer(state , {type , payload})
{
    switch(type)
    {
      case ACTIONS.ADD_DIGIT:
        if(state.overwrite)
        {
          return{
            ...state,
            currentOperands: payload.digit,
            overwrite: false,
          }
        }
        if(payload.digit === "0" && state.currentOperands === "0") 
        {
          return state
        } 
        if (payload.digit === "." && (state.currentOperands == null || state.currentOperands === "")) {
          return {
            ...state,
            currentOperands: "0.",
          }
        } 
        if(payload.digit === "." && state.currentOperands.includes("."))
        { 
          return state
        } 

        return {
          ...state,
         currentOperands: `${state.currentOperands || ""}${payload.digit}`
        }
        
      case ACTIONS.CHOOSE_OPERATION: 
        if(state.currentOperands == null && state.previousOperand == null)
          {
            return state
          } 

        if(state.currentOperands == null)
          {
            return{
              ...state,
              operation: payload.operation,
            }
          }  

        if(state.previousOperand == null)
          {
            return {
             ...state,
             operation: payload.operation,
             previousOperand: state.currentOperands,
             currentOperands: null
            }
          } 
          
        return{
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperands: null
        }  

      case ACTIONS.CLEAR: 
        return {} 

      case ACTIONS.DELETE_DIGIT:
        if(state.overwrite){
          return{
            ...state,
            overwrite: false,
            currentOperands: null,
          }
        }
        if(state.currentOperands == null)
        {
          return state
        }
        if(state.currentOperands.length === 1)
        {
          return{
            ...state,
            currentOperands: null
          }
        }
        return{
          ...state,
          currentOperands: state.currentOperands.slice(0 , -1)
        }
      
      case ACTIONS.EVALUATE:
        if(state.operation == null || state.currentOperands == null || state.previousOperand == null)
        {
          return state
        }
        return{
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperands: evaluate(state)
        }
           
    }
} 

function evaluate({currentOperands , previousOperand , operation})
{
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperands)
  if(isNaN(prev) || isNaN(current))
  {
    return ""
  }
  let computation = ""
  switch(operation){
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break  
    case "*":
      computation = prev * current
      break 
    case "÷":
      computation = prev / current
      break       
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",
  {
    maximumFractionDigits: 0,
  }
)

function formatOperand(operand){
  if(operand == null) return
  const [integer , decimal] = operand.split('.')
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`  
}

function App() {
  const [{currentOperands , previousOperand , operation} , dispatch] = useReducer(reducer , {})
  return (
   <div className="calculator-grid">
    <div className="output">
      <div className="previous-operand"> {formatOperand(previousOperand)} {operation} </div>
      <div className="current-operand">{ formatOperand(currentOperands)}</div>
    </div>
    <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})} >AC</button>
    <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})} >DEL</button>
    <OperationButton operation="÷" dispatch={dispatch}/>
    <DigitButton digit="1" dispatch={dispatch}/>
    <DigitButton digit="2" dispatch={dispatch}/>
    <DigitButton digit="3" dispatch={dispatch}/>
    <OperationButton operation="*" dispatch={dispatch}/>
    <DigitButton digit="4" dispatch={dispatch}/>
    <DigitButton digit="5" dispatch={dispatch}/>
    <DigitButton digit="6" dispatch={dispatch}/>
    <OperationButton operation="+" dispatch={dispatch}/>
    <DigitButton digit="7" dispatch={dispatch}/>
    <DigitButton digit="8" dispatch={dispatch}/>
    <DigitButton digit="9" dispatch={dispatch}/>
    <OperationButton operation="-" dispatch={dispatch}/>
    <DigitButton digit="." dispatch={dispatch}/>
    <DigitButton digit="0" dispatch={dispatch}/>
    <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})} >=</button>
   </div>
  )
}

export default App;
