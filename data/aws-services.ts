export interface AWSStep {
  id: number;
  title: string;
  description: string;
  consoleInstructions: string[];
  cliCommands: string[];
  screenshot?: string;
  tips: string[];
}

export interface AWSTutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  category: string;
  steps: AWSStep[];
  prerequisites: string[];
  learningObjectives: string[];
}

export interface AWSService {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tutorials: AWSTutorial[];
} 