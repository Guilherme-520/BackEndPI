const express = require('express');
const router = express.Router();
const {
    Eventos,
    ArquivoSubmetidos,
    Autores,
    Avaliadores,
    EventoUserCargo,
    AvaliadorSubAreas,
    SubAreas,
    Especialidades,
    ArquivoEspecialidades,
    AutorArquivos,
    RespostasAvaliacoes // Tabela para salvar as distribuições
} = require("../../../model/db");

router.post('/:nomeURL', async (req, res) => {
    try {
        const event = await Eventos.findOne({ where: { nomeURL: req.params.nomeURL } });

        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }

        // Busca avaliadores
        const avaliadores = await Avaliadores.findAll({
            where: { status: "Aprovado" } // Filtra apenas avaliadores aprovados
        });

        if (avaliadores.length === 0) {
            return res.status(404).json({ message: 'Não há avaliadores disponíveis para distribuição.' });
        }

        // Busca arquivos submetidos
        const arquivos = await ArquivoSubmetidos.findAll({ where: { idEventos: event.id } });

        if (arquivos.length === 0) {
            return res.status(404).json({ message: 'Não há arquivos submetidos para distribuição.' });
        }

        console.log("Arquivos encontrados:", arquivos);
        console.log("Avaliadores encontrados:", avaliadores);

        // Rastrear quantos arquivos cada avaliador recebeu
        const avaliadorDistribuicoes = new Map(avaliadores.map(avaliador => [avaliador.id, 0]));

        // Distribuir arquivos
        const distribuicoes = [];
        for (const arquivo of arquivos) {
            // Busca autor do arquivo
            const autor = await AutorArquivos.findOne({
                where: { idArquivo: arquivo.id }
            });

            // Lista de avaliadores que podem avaliar o arquivo
            let avaliadoresCandidatos = avaliadores.filter(avaliador => {
                return autor && autor.idInstituicoes !== avaliador.idInstituicoes; // Exclui da mesma instituição
            });

            if (avaliadoresCandidatos.length < 3) {
                // Se não houver candidatos suficientes, considera todos os avaliadores
                avaliadoresCandidatos = avaliadores;
            }

            // Ordena candidatos por menor número de distribuições para balanceamento
            avaliadoresCandidatos.sort((a, b) => {
                return (
                    (avaliadorDistribuicoes.get(a.id) || 0) -
                    (avaliadorDistribuicoes.get(b.id) || 0)
                );
            });

            // Seleciona os três primeiros candidatos
            const avaliadoresEscolhidos = avaliadoresCandidatos.slice(0, 3);

            if (avaliadoresEscolhidos.length < 3) {
                return res.status(400).json({
                    message: `Não há avaliadores suficientes para o arquivo ID ${arquivo.id}.`,
                });
            }

            // Adiciona as distribuições para os três avaliadores
            for (const avaliador of avaliadoresEscolhidos) {
                distribuicoes.push({
                    idArquivosSubmetidos: arquivo.id, // ID do arquivo submetido
                    idAvaliadores: avaliador.id, // ID do avaliador
                    respostas: "Pendente" // Resposta padrão
                });

                // Atualiza a contagem de distribuições
                avaliadorDistribuicoes.set(
                    avaliador.id,
                    (avaliadorDistribuicoes.get(avaliador.id) || 0) + 1
                );
            }
        }

        console.log("Distribuições geradas:", distribuicoes);

        // Salvar as distribuições na tabela RespostasAvaliacoes
        await RespostasAvaliacoes.bulkCreate(distribuicoes);

        res.status(200).json({
            message: 'Arquivos distribuídos e salvos com sucesso.',
            distribuicoes
        });
    } catch (error) {
        console.error('Erro ao distribuir arquivos:', error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
});

module.exports = router;
