import React from 'react';
import { CognitiveSettings } from '../components/settings/CognitiveSettings';

export const Profile = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black mb-2">Seu Perfil</h1>
        <p className="text-muted">Personalize sua experiência de aprendizado para adequar-se ao seu funcionamento cognitivo.</p>
      </div>

      {/* Settings Panel */}
      <CognitiveSettings />

    </div>
  );
};
