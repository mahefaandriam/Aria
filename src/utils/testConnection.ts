import { healthApi, contactApi } from '@/services/api';

export const testBackendConnection = async () => {
  console.log('🔍 Test de connexion au backend...');
  
  try {
    // Test de l'endpoint health
    console.log('📡 Test de l\'endpoint health...');
    const healthResponse = await healthApi.checkHealth();
    console.log('✅ Health check réussi:', healthResponse);
    
    // Test d'envoi de message de contact
    console.log('✉️ Test d\'envoi de message de contact...');
    const testMessage = {
      name: 'Test Utilisateur',
      email: 'test@example.com',
      company: 'Test Company',
      subject: 'Test de connexion',
      message: 'Ceci est un message de test pour vérifier la connexion entre le frontend et le backend.'
    };
    
    const contactResponse = await contactApi.sendMessage(testMessage);
    console.log('✅ Message de contact envoyé:', contactResponse);
    
    return {
      success: true,
      healthCheck: healthResponse,
      contactTest: contactResponse
    };
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

// Fonction pour tester l'API admin
export const testAdminAPI = async () => {
  console.log('🔐 Test de l\'API admin...');
  
  try {
    const { adminApi } = await import('@/services/api');
    
    // Test de connexion admin
    console.log('🔑 Test de connexion admin...');
    const loginResponse = await adminApi.login('admin@aria-creative.com', 'admin123');
    console.log('✅ Connexion admin réussie:', loginResponse);
    
    // Test de vérification du token
    console.log('🎫 Test de vérification du token...');
    const verifyResponse = await adminApi.verifyToken();
    console.log('✅ Token vérifié:', verifyResponse);
    
    return {
      success: true,
      login: loginResponse,
      verify: verifyResponse
    };
    
  } catch (error) {
    console.error('❌ Erreur lors des tests admin:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};
