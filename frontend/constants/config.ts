import Constants from 'expo-constants';

const config = Constants.expoConfig || Constants.manifest;

export const BACKEND_URL = config?.extra?.BACKEND_URL || 'http://localhost:8000';
