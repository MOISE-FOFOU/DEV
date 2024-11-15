import { test, expect } from '../KlivarCreate';
import fs from 'fs';
import path from 'path';

// Chargement des chemins de fichiers JSON et PDF
const dataFilePath = path.resolve(__dirname, 'data', 'data.json');
const captFilePath = path.resolve(__dirname, 'data', 'capt.pdf');

// Lecture des données JSON
const jsonData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

// Test complet avec validation séquentielle des blocs
test('test de création des informations de base et des blocs suivants', async ({ page }) => {
  // 1. Remplissage des informations de base (bloc 1)
  await page.getByPlaceholder('Identifiant unique pour les').fill(jsonData.informations_de_base.siret);
  await page.getByPlaceholder('Nom légal de l\'entreprise').fill(jsonData.informations_de_base.nomSociete);
  await page.locator('#rc_select_0').fill(jsonData.informations_de_base.pays);
  await page.getByText(jsonData.informations_de_base.pays).click();
  await page.getByPlaceholder('Ligne d\'adresse').fill(jsonData.informations_de_base.adresse);
  await page.getByPlaceholder('Numéro de contact principal').fill(jsonData.informations_de_base.telephone);
  await page.getByPlaceholder('Email pour la correspondance').fill(jsonData.informations_de_base.emailProfessionnel);
  await page.getByPlaceholder('Code de vérification').waitFor({ state: 'visible' });
  await page.getByPlaceholder('Code de vérification').fill(jsonData.informations_de_base.code);
  await page.getByRole('button', { name: 'Vérifier' }).click();
  await page.getByRole('button', { name: 'Vérifier' }).waitFor({ state: 'hidden' });

  // Attente du bouton "Suivant" et clic
  await page.getByRole('button', { name: 'Suivant' }).click();

  // 2. Attente de l'apparition du texte "Représentants légaux" pour valider que le deuxième bloc est affiché
  await expect(page.locator('text=Représentants légaux')).toBeVisible();

  // Remplissage des informations des représentants légaux (bloc 2)
    await page.getByPlaceholder('Nom et pénom').fill(jsonData.representants_legaux.nom);
// remplir le champ "Titre/Position" (si pas masqué)
  await page.getByPlaceholder('Fonction au sein de l\'entreprise(ex., PDG, Directeur financier)').fill(jsonData.representants_legaux.titrePosition);
  // 3. Remplir le champ "Téléphone"
  await page.getByPlaceholder('Numéro de contact direct').fill(jsonData.representants_legaux.telephone);
  await page.getByPlaceholder('Adresse e-mail professionnelle du représentant.').fill(jsonData.representants_legaux.email);

  // 4. Remplir le champ "Adresse e-mail"

  await page.getByRole('button', { name: 'Suivant' }).click();
  
  await expect(page.locator('text=Contact technique')).toBeVisible();

  // Bloc 3 : Remplissage d await page.getByPlaceholder('Nom et pénom').fill(jsonData.representants_legaux.nom);
// remplir le champ "Titre/Position" (si pas masqué)
await page.getByPlaceholder('Nom et pénom').fill(jsonData.representants_legaux.nom);
await page.getByPlaceholder('Numéro de contact direct').fill(jsonData.representants_legaux.telephone);
  await page.getByPlaceholder('Adresse e-mail').fill(jsonData.representants_legaux.email);
  // Remplir le champ Capital social
  await page.getByRole('button', { name: 'Suivant' }).click();

  // Remplir le champ Chiffre d'affaires annuel
  const turnoverInput = page.locator('input[placeholder="Chiffre d\'affaires réalisé lors du dernier exercice comptable."]');
  await turnoverInput.fill(jsonData.finances.chiffreAffaires);
  await expect(turnoverInput).toHaveValue(jsonData.finances.chiffreAffaires);

  // Remplir le champ Nombre d'employés
  const employeesInput = page.locator('input[placeholder="Nombre"]');
  await employeesInput.fill(jsonData.finances.nombreEmployes);
  await expect(employeesInput).toHaveValue(jsonData.finances.nombreEmployes);
  
  // Cliquer sur le bouton "Suivant" pour avancer
  await page.getByRole('button', { name: 'Suivant' }).click();

  // 4. Téléchargement des fichiers PDF (bloc 4)
 // 4. Téléchargement des fichiers PDF (bloc 4)

// Remplissage direct du champ de téléchargement pour "Extrait Kbis de moins de 3 mois"
await page.locator('input[type="file"]').nth(0).setInputFiles(captFilePath);
await expect(page.getByRole('link', { name: 'kbis' })).toBeVisible();
await page.locator('input[type="file"]').nth(1).setInputFiles(captFilePath);
await expect(page.getByRole('link', { name: 'official document' })).toBeVisible();

await page.getByRole('button', { name: 'Suivant' }).click();


  // 5. Remplissage des informations de sécurité (bloc 5)
  // Remplissage de l'email pour la correspondance
await page.getByPlaceholder('Email pour la correspondance').fill(jsonData.securite.emailCorrespondance);

// Attente de la visibilité du champ "Code de vérification" et remplissage
await page.getByPlaceholder('Code de vérification').waitFor({ state: 'visible' });
await page.getByPlaceholder('Code de vérification').fill(jsonData.informations_de_base.code);

// Clic sur le bouton de vérification et attendre que l'élément soit masqué
await page.getByRole('button', { name: 'Vérifier' }).click();
await page.getByRole('button', { name: 'Vérifier' }).waitFor({ state: 'hidden' });

// Remplissage du mot de passe et de sa confirmation
await page.getByPlaceholder('********').first().fill(jsonData.securite.motDePasse);
await page.locator('input[placeholder="********"]').nth(1).fill(jsonData.securite.confirmationMotDePasse);

// Sélection de la question de sécurité
await page.locator('#rc_select_1').click();
  await page.getByTitle('Quel est le nom de jeune').locator('div').click();

// Remplissage de la réponse à la question de sécurité
await page.getByPlaceholder('xxxxxx').fill(jsonData.securite.reponseSecurite);

// Cocher les cases pour accepter les conditions générales et la politique de confidentialité
await page.getByLabel('J\'accepte les conditions générales d\'utilisation').check();
await page.getByLabel('J\'ai lu et j\'accepte la politique de confidentialité').check();

// Clic sur le bouton "Suivant" pour validation finale
await page.getByRole('button', { name: 'Soumettre' }).click();

  // Attente du chargement final pour confirmer la fin du test
  await page.waitForLoadState('load');
});
