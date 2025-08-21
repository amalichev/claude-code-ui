import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectManagerProps {
  projects: Project[];
  activeProject: string | null;
  onSelectProject: (projectId: string | null) => void;
  onCreateProject: (name: string, path: string) => void;
  onDeleteProject: (projectId: string) => void;
  onSelectDirectory: () => Promise<string | null>;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onSelectDirectory,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedPath, setSelectedPath] = useState('');

  const handleSelectDirectory = async () => {
    const path = await onSelectDirectory();
    if (path) {
      setSelectedPath(path);
    }
  };

  const handleCreateProject = () => {
    if (newProjectName.trim() && selectedPath) {
      onCreateProject(newProjectName.trim(), selectedPath);
      setNewProjectName('');
      setSelectedPath('');
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setNewProjectName('');
    setSelectedPath('');
    setIsCreating(false);
  };

  return (
    <div className="p-4 border-b border-claude-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-claude-text">Projects</h3>
          <button
            onClick={() => setIsCreating(true)}
            className="text-xs bg-claude-accent hover:bg-claude-accent/80 text-white px-2 py-1 rounded transition-colors"
          >
            + Add
          </button>
        </div>

        {isCreating && (
          <div className="mb-4 p-3 bg-white/5 rounded-lg">
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full bg-claude-bg border border-claude-border rounded px-2 py-1 text-sm mb-2 text-claude-text whitespace-nowrap"
            />

            <div className="mb-2">
              <button
                onClick={handleSelectDirectory}
                className="w-full text-left bg-claude-bg border border-claude-border rounded px-2 py-1 text-sm text-claude-text-secondary hover:bg-claude-hover"
              >
                {selectedPath || 'Select directory...'}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim() || !selectedPath}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-xs py-1 rounded transition-colors"
              >
                Create
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-1 max-h-48 overflow-y-auto">
          <div
            onClick={() => onSelectProject(null)}
            className={`p-4 rounded cursor-pointer transition-colors ${
              activeProject === null
                ? 'bg-claude-accent text-white'
                : 'text-claude-text-secondary hover:bg-claude-hover hover:text-claude-text'
            }`}
          >
            <div className="text-sm">No Project</div>
            <div className="text-xs opacity-75">General chat mode</div>
          </div>

          {projects.map((project) => (
            <div
              key={project.id}
              className={`p-4 rounded transition-colors group flex items-center justify-between ${
                activeProject === project.id
                  ? 'bg-claude-accent text-white'
                  : 'text-claude-text-secondary hover:bg-claude-hover hover:text-claude-text'
              }`}
            >
              <div
                onClick={() => onSelectProject(project.id)}
                className="cursor-pointer flex-1 min-w-0 pr-2"
              >
                <div className="text-sm font-medium truncate">{project.name}</div>
                <div className="text-xs opacity-75 truncate">{project.path}</div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProject(project.id);
                }}
                className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/20 flex-shrink-0 self-center ${
                  activeProject === project.id
                    ? 'text-white'
                    : 'text-red-400'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
    </div>
  );
};

export default ProjectManager;