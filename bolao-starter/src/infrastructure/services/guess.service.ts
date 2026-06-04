import { GuessRepository } from "../repositories/guess.repository.js";
import { MatchRepository } from "../repositories/match.repository.js";
import { PoolRepository } from "../repositories/pool.repository.js";

const guessRepo = new GuessRepository();
const matchRepo = new MatchRepository();
const poolRepo = new PoolRepository();

export class GuessService {
  async create(payload: {
    poolId: number;
    participantId: number;
    matchId: number;
    homeScore: number;
    awayScore: number;
  }) {
    // 1. buscar a partida pelo matchId — se não existir: { status: 404, message: "Partida não encontrada" }
    const match = await matchRepo.findById(payload.matchId);

    if (!match) {
      throw { status: 404, message: "Partida não encontrada" };
    }

    // 2. verificar se match.kickoffAt > new Date() — se não: { status: 409, message: "Partida já iniciada" }
    if (match.kickoffAt <= new Date()) {
      throw { status: 409, message: "Partida já iniciada" };
    }

    // 3. verificar se participante existe no bolão — se não: { status: 404, message: "Participante não encontrado neste bolão" }
    const participant = await poolRepo.findParticipant(payload.poolId, payload.participantId);

    if (!participant) {
      throw { status: 404, message: "Participante não encontrado neste bolão" };
    }

    // 4. verificar se já existe palpite (findByParticipantAndMatch) — se sim: { status: 409, message: "Palpite já registrado para esta partida" }
    const existingGuess = await guessRepo.findByParticipantAndMatch(
      payload.participantId,
      payload.matchId,
      payload.poolId,
    );

    if (existingGuess) {
      throw { status: 409, message: "Palpite já registrado para esta partida" };
    }

    // 5. criar e retornar o palpite
    return await guessRepo.create(payload);
  }

  async update(id: number, payload: { homeScore?: number; awayScore?: number }) {
    // 1. buscar o palpite pelo id — se não existir: { status: 404, message: "Palpite não encontrado" }
    const guess = await guessRepo.findById(id);

    if (!guess) {
      throw { status: 404, message: "Palpite não encontrado" };
    }

    // 2. verificar se match.kickoffAt > new Date() — se não: { status: 400, message: "Não é possível editar palpite após o início da partida" }
    const match = await matchRepo.findById(guess.matchId);

    if (!match) {
      throw { status: 400, message: "Não é possível editar palpite após o início da partida" };
    }

    if (match.kickoffAt <= new Date()) {
      throw { status: 400, message: "Não é possível editar palpite após o início da partida" };
    }

    // 3. atualizar e retornar o palpite
    return await guessRepo.update(id, payload);
  }

  async ranking(poolId: number) {
    // 1. verificar se o bolão existe — se não: { status: 404, message: "Bolão não encontrado" }
    const pool = await poolRepo.findById(poolId);

    if (!pool) {
      throw { status: 404, message: "Bolão não encontrado" };
    }

    // 2. buscar todos os palpites do bolão (listByPool)
    const guesses = await guessRepo.listByPool(poolId);

    // 3. agrupar por participante somando points (1 pontos para acerto exato ou empate, 0 pontos para palpite errado)
    const pointsByParticipant: Record<
      number,
      { participantId: number; name: string; email: string; totalPoints: number }
    > = {};

    for (const guess of guesses) {
      const participantId = guess.participantId;
      const participantName = guess.participant?.name || "Usuário Sem Nome";
      const participantEmail = guess.participant?.email || "";

      // Inicializa o participante no mapa se for a primeira vez dele
      if (!pointsByParticipant[participantId]) {
        pointsByParticipant[participantId] = {
          participantId,
          name: participantName,
          email: participantEmail,
          totalPoints: 0,
        };
      }

      if (guess.match.homeScore === null || guess.match.awayScore === null) {
        continue;
      }

      const isExactScore =
        guess.match.homeScore === guess.homeScore && guess.match.awayScore === guess.awayScore;

      const realResult = Math.sign(guess.match.homeScore - guess.match.awayScore);
      const guessResult = Math.sign(guess.homeScore - guess.awayScore);
      const isCorrectResult = realResult === guessResult;

      if (isExactScore) {
        pointsByParticipant[participantId].totalPoints += 3;
      } else if (isCorrectResult) {
        pointsByParticipant[participantId].totalPoints += 1;
      }
    }

    // 4. retornar array ordenado por totalPoints desc:
    //    [{ participantId, name, email, totalPoints }]
    return Object.values(pointsByParticipant).sort((a, b) => b.totalPoints - a.totalPoints);
  }

  async removeParticipant(poolId: number, participantId: number) {
    // 1. verificar se o bolão existe — se não: { status: 404, message: "Bolão não encontrado" }
    const pool = await poolRepo.findById(poolId);

    if (!pool) {
      throw { status: 404, message: "Bolão não encontrado" };
    }

    // 2. verificar se participante existe no bolão — se não: { status: 404, message: "Participante não encontrado" }
    const participant = await poolRepo.findParticipant(poolId, participantId);

    if (!participant) {
      throw { status: 404, message: "Participante não existe" };
    }

    // 3. remover e retornar undefined (204)
    await poolRepo.removeParticipant(poolId, participantId);

    return { message: "Removido com sucesso" };
  }
}
