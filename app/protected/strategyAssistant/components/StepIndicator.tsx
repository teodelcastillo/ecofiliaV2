import React from "react"

interface StepIndicatorProps {
  currentStep: number
  totalSteps?: number
  
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps = 3 }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${
              currentStep >= step ? "bg-green-600 text-white" : "bg-slate-200 text-slate-500"
            }`}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-16 h-1 transition-colors duration-300 ${
                currentStep > step ? "bg-green-600" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}  