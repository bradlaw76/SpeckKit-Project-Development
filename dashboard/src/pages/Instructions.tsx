import { useState } from 'react';

type InstructionsTab = 'reference' | 'checklist';

export default function Instructions() {
  const [activeTab, setActiveTab] = useState<InstructionsTab>('reference');

  return (
    <div className="page">
      <h1>Instructions</h1>
      <p>Spec Kit + Squad combined workflow reference and checklist.</p>

      <div className="tab-bar">
        <button
          className={`tab ${activeTab === 'reference' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('reference')}
        >
          Reference
        </button>
        <button
          className={`tab ${activeTab === 'checklist' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('checklist')}
        >
          Checklist
        </button>
      </div>

      {activeTab === 'reference' && <ReferenceTab />}
      {activeTab === 'checklist' && <ChecklistTab />}
    </div>
  );
}

function ReferenceTab() {
  return <div>Reference content coming soon.</div>;
}

function ChecklistTab() {
  return <div>Checklist content coming soon.</div>;
}
