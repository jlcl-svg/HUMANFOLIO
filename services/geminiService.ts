// Este serviço foi desativado para remover dependências de IA (Google GenAI)
// e permitir o deploy simplificado no Vercel.
// As funções abaixo são stubs (falsas) para manter a compatibilidade de tipos.

export const analyzeTextForHumanity = async (text: string) => {
    return { 
        score: 50, 
        reasoning: "Análise por IA desativada temporariamente.", 
        isAiSuspect: false 
    };
};

export const generatePhilosophicalProvocation = async () => {
    return "A realidade é apenas um consenso processado.";
};
