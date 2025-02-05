import { Router } from "express";
import { findTrainers, upsertTrainer, findTrainer, deleteTrainer } from "~/server/utils/trainer";
import { findPokemon } from "~/server/utils/pokemon";

const router = Router();

router.get("/hello", (_req, res) => {
  res.send("Hello World");
});

/** トレーナー名の一覧の取得 */
router.get("/trainers", async (_req, res, next) => {
  try {
    const trainers = await findTrainers();
    const trainersNames = trainers.map(item => item.Key.split(".")[0]);
    res.send(trainersNames);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの追加 */
router.post("/trainer", async (req, res, next) => {
  try {
    // 名前がかかれているかどうか
    if (!req.body.name) {
      return res.status(400).send("Trainer name is required");
    }
    // 既にトレーナーが存在するかどうか
    const trainers = await findTrainers();
    const trainersNames = trainers.map(item => item.Key.split(".")[0]);
    if (trainersNames.includes(req.body.name)) {
      return res.status(409).send("Trainer already exists");
    }
    const result = await upsertTrainer(req.body.name, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの取得 */
router.get("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    const trainer = await findTrainer(trainerName);
    res.send(trainer);
  } catch (err) {
    next(err);
  }
});


/** トレーナーの更新 */
router.post("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    // TODO: トレーナーが存在していなければ404を返す
    const result = await upsertTrainer(trainerName, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの削除 */
// TODO: トレーナーを削除する API エンドポイントの実装
router.delete("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    const trainer = await findTrainer(trainerName);
    if (!trainer) {
      return res.status(404).send("Trainer not found");
    }
    await deleteTrainer(trainerName);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/** ポケモンの追加 */
router.post("/trainer/:trainerName/pokemon", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    // リクエストボディにポケモン名が含まれていなければ400を返す
    if (!req.body.name) {
      return res.status(400).send("Pokemon name is required");
    }
    const pokemon = await findPokemon(req.body.name);
    const trainer_info = await findTrainer(trainerName);
    const pokemon_info = {
      name: pokemon.name,
      nickname: pokemon.name,
      // type: pokemon.types.map(type => type.type.name),
      // height: pokemon.height,
      // weight: pokemon.weight,
      // abilities: pokemon.abilities.map(ability => ability.ability.name),
      image: pokemon.sprites.front_default
    }
    trainer_info.pokemons.push(pokemon_info)
    // TODO: 削除系 API エンドポイントを利用しないかぎりポケモンは保持する
    const result = await upsertTrainer(trainerName, trainer_info);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** ポケモンのニックネームを更新 */
router.put("/trainer/:trainerName/pokemon/:pokemonName", async (req, res, next) => {
  try {
    const { trainerName, pokemonName } = req.params;
    const trainer = await findTrainer(trainerName);
    const pokemon = trainer.pokemons.find(pokemon => pokemon.name === pokemonName);
    if (!pokemon) {
      return res.status(404).send("Pokemon not found");
    }
    pokemon.nickname = req.body.nickname;
    const result = await upsertTrainer(trainerName, trainer);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** ポケモンの削除 */
router.delete("/trainer/:trainerName/pokemon/:pokemonName", async (req, res, next) => {
  try {
    const { trainerName, pokemonName } = req.params;
    const trainer = await findTrainer(trainerName);
    if (!trainer) {
      return res.status(404).send("Trainer not found");
    }
    const pokemonIndex = trainer.pokemons.findIndex(pokemon => pokemon.name === pokemonName);
    if (pokemonIndex === -1) {
      return res.status(404).send("Pokemon not found");
    }
    trainer.pokemons.splice(pokemonIndex, 1);
    const result = await upsertTrainer(trainerName, trainer);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});
export default router;
