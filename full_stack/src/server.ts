import express, { Request, Response } from "express";
import multer from "multer";
import Papa from "papaparse";
import cors from "cors";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

/**
 * Classe représentant une question (Token).
 */
class Token {
  id: string;
  level: number;
  topic: string;
  subtopic: string;
  label: string;

  /**
   * Constructeur de la classe Token.
   * @param level - Le niveau de la question.
   * @param topic - Le sujet principal de la question.
   * @param subtopic - Le sous-sujet de la question.
   * @param label - Le libellé de la question.
   */
  constructor(level: number, topic: string, subtopic: string, label: string) {
    this.id = topic + subtopic + label; // Identifiant unique basé sur les propriétés
    this.level = level;
    this.topic = topic;
    this.subtopic = subtopic;
    this.label = label;
  }
}

/**
 * Route POST pour gérer le téléchargement et le traitement d'un fichier CSV.
 */
app.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).send("No file.");
      return;
    }

    try {
      const fileContent = fs.readFileSync(req.file.path, "utf8");

      // Parsing du contenu CSV avec PapaParse
      const parsedData = Papa.parse(fileContent, { header: true });

      fs.unlinkSync(req.file.path);

      // Vérification que les données sont valides
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        res.status(400).send("Bad CSV data.");
        return;
      }

      // Extraction des sous-sujets (subtopics) uniques
      const subtopic = Array.from(
        new Map(
          (parsedData.data as Array<Record<string, string>>)
            .map((row) => ({
              topic: row.topic,
              subtopic: row.subtopic,
            }))
            .filter((row) => row.topic && row.subtopic) // Exclure les champs vides
            .map((row) => [row.topic + row.subtopic, row]) // Clé unique combinant `topic` et `subtopic`
        ).values()
      );

      // Extraction des sujets (topics) uniques
      const topic = Array.from(
        new Map(
          (parsedData.data as Array<Record<string, string>>)
            .map((row) => ({ topic: row.topic }))
            .filter((row) => row.topic) // Exclure les champs vides
            .map((row) => [row.topic, row]) // Clé unique basée sur `topic`
        ).values()
      );

      // Conversion des lignes en instances de Token
      const question = (parsedData.data as Array<Record<string, string>>).map(
        (row) =>
          new Token(
            parseInt(row.level || "1", 10), // Niveau (par défaut à 1)
            row.topic || "",
            row.subtopic || "",
            row["question label"] || "" // Libellé de la question
          )
      );

      // Réponse JSON avec les données extraites
      res.json({ topic, subtopic, question });
    } catch (err) {
      console.error("Error :", err);
      res.status(500).send("An error occured");
    }
  }
);

// Démarrage du serveur sur le port spécifié
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
