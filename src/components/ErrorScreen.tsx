import React from 'react'

interface ErrorScreenProps {
  onRetry: () => void
  isLoading: boolean
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ onRetry, isLoading }) => {
  return (
    <div className="min-h-screen bg-rixa-dark-shadow flex items-center justify-center p-4">
      <div className="bg-rixa-dark rounded-lg p-8 border border-rixa-red/30 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-rixa-red/20 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-rixa-red" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-rixa-cream mb-2">
            Serviço Indisponível
          </h1>
          <p className="text-rixa-cream/70 mb-6">
            Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.
          </p>
        </div>
        
        <button
          onClick={onRetry}
          disabled={isLoading}
          className="w-full bg-rixa-blue hover:bg-rixa-blue/80 disabled:bg-rixa-blue/50 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Verificando...
            </>
          ) : (
            'Tentar Novamente'
          )}
        </button>
        
        <div className="mt-4 text-xs text-rixa-cream/50">
          O sistema tentará reconectar automaticamente a cada 30 segundos.
        </div>
      </div>
    </div>
  )
}