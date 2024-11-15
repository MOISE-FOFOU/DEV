import { devices, PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  timeout: 1000000, // Timeout global pour chaque test
  retries: 1, // Nombre de tentatives en cas d'échec
  use: {
    trace: 'on-first-retry', // Active les traces sur la première tentative échouée
  },
  projects: [
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'], // Utilise la configuration par défaut pour Firefox sur bureau
        browserName: 'firefox', // Spécifie l'utilisation de Firefox
        headless: false, // Mettre à false pour voir le navigateur en action
        video: {
          mode: 'on', // Modes possibles: 'on', 'off', 'retain-on-failure', 'on-first-retry'
          size: { width: 1280, height: 720 }, // Taille des vidéos
        },
        screenshot: 'on', // Captures d'écran seulement en cas d'échec
      },
    },
  ],
};

export default config;
