import React, { useState, useRef } from 'react';

const App: React.FC = () => {
  // États pour stocker les données extraites du fichier CSV
  const [topics, setTopics] = useState<any[]>([]);
  const [subtopics, setSubtopics] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);

  // Référence pour stocker les réponses utilisateur (sous forme d'objet clé-valeur)
  const formRef = useRef<Record<string, string>>({});

  // Map pour gérer la numérotation des questions en fonction de leur niveau
  const nested = new Map<number, number>();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Envoi du fichier au backend pour le traitement
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du fichier');
      }

      const data = await response.json();

      setTopics(data.topic);
      setSubtopics(data.subtopic);
      setQuestions(data.question);

      // Initialisation des réponses utilisateur
      data.question.forEach((q: any) => {
        formRef.current[q.id] = '';
      });
    } catch (error) {
      console.error(error);
    }
  };


  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formRef.current), // Envoi des réponses utilisateur au backend
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du formulaire');
      }

      alert('Formulaire soumis avec succès !');
    } catch (error) {
      console.error(error);
    }
  };

  // Génère la numérotation hiérarchique d'une question
  const renderLevelQuestion = () => {
    let result = '';
    nested.forEach((value) => {
      result += `${value}.`;
    });
    return result;
  };

  // Génère le label d'une question avec sa numérotation
  const renderQuestion = (questionIndex: number) => {
    const questionLevel = questions[questionIndex].level;

    if (!nested.has(questionLevel)) {
      nested.set(questionLevel, 1);
    } else {
      nested.set(questionLevel, (nested.get(questionLevel) || 0) + 1);

      // Réinitialisation des niveaux inférieurs
      nested.forEach((_, key) => {
        if (key > questionLevel) {
          nested.delete(key);
        }
      });
    }

    return `${renderLevelQuestion()} ${questions[questionIndex].label}`;
  };

  // Styles des champs de saisie
  const inputStyle = {
    width: '80%',
    padding: '10px',
    margin: '5px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  // Styles des labels
  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#4CAF50' }}>Import a CSV file</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{
          display: 'block',
          margin: '20px auto',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      />

      <h2 style={{ color: '#4CAF50' }}>CSV file content :</h2>

      {questions.length > 0 ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            {topics.map((topic, topicIndex) => (
              <div key={topicIndex} style={{ marginLeft: '10px', marginBottom: '20px' }}>
                <h3 style={{ color: '#3B3B98' }}>{topic.topic}</h3>
                {subtopics.map((subtopic, subtopicIndex) =>
                  subtopic.topic === topic.topic ? (
                    <div key={subtopicIndex} style={{ marginLeft: '10px' }}>
                      <h4 style={{ color: '#3B3B98' }}>{subtopic.subtopic}</h4>
                      {nested.clear()}
                      {questions.map((question, questionIndex) =>
                        question.topic === topic.topic && question.subtopic === subtopic.subtopic ? (
                          <div
                            key={questionIndex}
                            style={{ marginLeft: `${question.level * 5}px`, marginBottom: '10px' }}
                          >
                            <label htmlFor={question.id} style={labelStyle}>
                              {renderQuestion(questionIndex)}
                            </label>
                            <input
                              id={question.id}
                              type="text"
                              placeholder="Votre réponse..."
                              onChange={(e) => {
                                formRef.current[question.id] = e.target.value;
                              }}
                              style={inputStyle}
                            />
                          </div>
                        ) : null
                      )}
                    </div>
                  ) : null
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Soumettre
            </button>
          </div>
        </form>
      ) : (
        <p style={{ color: '#888' }}>No data available.</p>
      )}
    </div>
  );
};

export default App;
