// Roda antes de "dev" e "build" (veja package.json).
// Escaneia public/avatars/ e gera src/data/avatars.generated.json
// com a lista de imagens disponíveis para escolha de foto de perfil.
import { readdirSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const AVATARS_DIR = join(process.cwd(), "public", "avatars");
const OUT_FILE = join(process.cwd(), "src", "data", "avatars.generated.json");
const VALID_EXT = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

if (!existsSync(AVATARS_DIR)) {
  mkdirSync(AVATARS_DIR, { recursive: true });
}

const files = readdirSync(AVATARS_DIR).filter((f) =>
  VALID_EXT.includes(extname(f).toLowerCase())
);

const avatars = files.sort().map((f) => `/avatars/${f}`);

mkdirSync(join(process.cwd(), "src", "data"), { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(avatars, null, 2));

console.log(
  `[avatars] ${avatars.length} imagem(ns) encontrada(s) em public/avatars → src/data/avatars.generated.json`
);
