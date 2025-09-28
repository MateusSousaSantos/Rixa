import React from 'react'
import { ShareButton } from './posts/ShareButton'

const ShareDemo: React.FC = () => {
  const demoPost = {
    postId: 1,
    author: "Alice",
    content: "Acabei de terminar de ler um livro incrível sobre ética em IA! A interseção entre tecnologia e filosofia é fascinante.",
    postType: 'normal' as const
  }

  return (
    <div className="bg-rixa-dark rounded-lg border border-rixa-blue/20 p-6 m-4">
      <h2 className="text-rixa-cream text-xl font-bold mb-4">Teste de Compartilhamento</h2>
      
      <div className="bg-rixa-dark-shadow rounded p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
            A
          </div>
          <div>
            <h3 className="font-semibold text-rixa-cream">{demoPost.author}</h3>
            <p className="text-sm text-rixa-cream/60">2 horas atrás</p>
          </div>
        </div>
        <p className="text-rixa-cream/90 mb-3">{demoPost.content}</p>
        
        <div className="flex gap-6">
          <ShareButton options={demoPost} />
        </div>
      </div>
      
      <div className="text-rixa-cream/60 text-sm">
        <p>Clique no botão de compartilhar para testar as opções:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Compartilhamento nativo (no mobile)</li>
          <li>Copiar link</li>
          <li>Compartilhar em redes sociais</li>
        </ul>
      </div>
    </div>
  )
}

export { ShareDemo }