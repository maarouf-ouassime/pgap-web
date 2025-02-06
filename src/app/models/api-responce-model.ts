export interface ApiResponse<T> {
  success: boolean; // Indique si la requête a réussi
  code: number;     // Code de statut HTTP ou code d'erreur personnalisé
  message: string;  // Message descriptif (peut être utilisé pour les erreurs ou les succès)
  data?: T ;         // Données de la réponse (optionnelles, car elles peuvent être null)
}
