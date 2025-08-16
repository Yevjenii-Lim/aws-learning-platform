// API utilities for serverless lesson data access
export const API_ENDPOINTS = {
  LESSONS: '/api/lessons',
  SERVICES: '/api/services',
  PROGRESS: '/api/progress',
  CONTENT: '/api/content',
} as const;

// API response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LessonAPIResponse {
  serviceId: string;
  tutorialId: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  steps: any[];
  learningObjectives: string[];
}

// API utilities
export async function fetchLessons(): Promise<APIResponse<any[]>> {
  try {
    const response = await fetch(API_ENDPOINTS.LESSONS);
    return await response.json();
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return { success: false, error: 'Failed to fetch lessons' };
  }
}

export async function fetchService(serviceId: string): Promise<APIResponse<any>> {
  try {
    const response = await fetch(`${API_ENDPOINTS.SERVICES}/${serviceId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching service:', error);
    return { success: false, error: 'Failed to fetch service' };
  }
}

export async function fetchTutorial(serviceId: string, tutorialId: string): Promise<APIResponse<any>> {
  try {
    const response = await fetch(`${API_ENDPOINTS.LESSONS}/${serviceId}/${tutorialId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching tutorial:', error);
    return { success: false, error: 'Failed to fetch tutorial' };
  }
}

export async function saveProgress(progress: any): Promise<APIResponse<boolean>> {
  try {
    const response = await fetch(API_ENDPOINTS.PROGRESS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progress),
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving progress:', error);
    return { success: false, error: 'Failed to save progress' };
  }
}

export async function getProgress(userId: string, serviceId: string, tutorialId: string): Promise<APIResponse<any>> {
  try {
    const response = await fetch(`${API_ENDPOINTS.PROGRESS}/${userId}/${serviceId}/${tutorialId}`);
    return await response.json();
  } catch (error) {
    console.error('Error getting progress:', error);
    return { success: false, error: 'Failed to get progress' };
  }
} 