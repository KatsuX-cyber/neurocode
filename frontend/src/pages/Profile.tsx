import React from 'react';
import { CognitiveSettings } from '../components/settings/CognitiveSettings';
import { InterestPicker } from '../components/settings/InterestPicker';

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

      {/* NAIS: Interest Picker */}
      <section className="bg-surface/50 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
        <InterestPicker />
      </section>
    </div>
  );
};
