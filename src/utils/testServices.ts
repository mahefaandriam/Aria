import { healthApi, adminApi, projectsApi, contactApi, uploadApi } from '@/services/api';

interface TestResult {
  service: string;
  status: 'success' | 'error';
  message: string;
  details?: any;
}

export class SystemTester {
  static async runCompleteTest(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    // Test 1: Santé de l'API
    try {
      const health = await healthApi.checkHealth();
      results.push({
        service: 'API Health',
        status: 'success',
        message: `✅ API accessible - Uptime: ${Math.floor(health.data?.uptime || 0)}s`,
        details: health.data
      });
    } catch (error) {
      results.push({
        service: 'API Health',
        status: 'error',
        message: `❌ API inaccessible: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        details: error
      });
    }

    // Test 2: Authentification admin
    try {
      const login = await adminApi.login('admin@aria-creative.com', 'admin123');
      if (login.success) {
        results.push({
          service: 'Admin Auth',
          status: 'success',
          message: `✅ Authentification admin OK - User: ${login.user.name}`,
          details: { user: login.user }
        });

        // Test 2.1: Vérification du token
        try {
          const verify = await adminApi.verifyToken();
          results.push({
            service: 'Token Verification',
            status: 'success',
            message: `✅ Token valide`,
            details: verify.data
          });
        } catch (error) {
          results.push({
            service: 'Token Verification',
            status: 'error',
            message: `❌ Token invalide`,
            details: error
          });
        }
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      results.push({
        service: 'Admin Auth',
        status: 'error',
        message: `❌ Échec authentification: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        details: error
      });
    }

    // Test 3: Récupération des projets
    try {
      const projects = await projectsApi.getPublicProjects();
      results.push({
        service: 'Projects API',
        status: 'success',
        message: `✅ Projets publics: ${projects.data?.projects.length || 0} trouvés`,
        details: { count: projects.data?.projects.length }
      });
    } catch (error) {
      results.push({
        service: 'Projects API',
        status: 'error',
        message: `❌ Erreur projets: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        details: error
      });
    }

    // Test 4: Test configuration email
    try {
      const emailTest = await contactApi.testEmailConfig();
      results.push({
        service: 'Email Config',
        status: emailTest.success ? 'success' : 'error',
        message: emailTest.success ? '✅ Configuration email OK' : '❌ Problème configuration email',
        details: emailTest
      });
    } catch (error) {
      results.push({
        service: 'Email Config',
        status: 'error',
        message: `❌ Test email échoué: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        details: error
      });
    }

    return results;
  }

  static async testProjectsCrud(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    let testProjectId: string | null = null;

    try {
      // Test création projet
      const newProject = {
        title: `Test Project ${Date.now()}`,
        description: "Projet de test automatique",
        technologies: ["Test", "API"],
        client: "Test Client",
        duration: "1 semaine",
        status: "EN_ATTENTE" as const,
        date: new Date().toLocaleDateString('fr-FR')
      };

      const created = await projectsApi.createProject(newProject);
      if (created.success && created.data) {
        testProjectId = created.data.project.id;
        results.push({
          service: 'Create Project',
          status: 'success',
          message: `✅ Projet créé: ${created.data.project.title}`,
          details: created.data.project
        });

        // Test mise à jour
        const updated = await projectsApi.updateProject(testProjectId, {
          status: 'EN_COURS'
        });
        if (updated.success) {
          results.push({
            service: 'Update Project',
            status: 'success',
            message: `✅ Projet mis à jour`,
            details: updated.data
          });
        }

        // Test suppression
        const deleted = await projectsApi.deleteProject(testProjectId);
        if (deleted.success) {
          results.push({
            service: 'Delete Project',
            status: 'success',
            message: `✅ Projet supprimé`,
            details: deleted
          });
        }
      }
    } catch (error) {
      results.push({
        service: 'CRUD Projects',
        status: 'error',
        message: `❌ Erreur CRUD: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        details: error
      });

      // Nettoyer en cas d'erreur
      if (testProjectId) {
        try {
          await projectsApi.deleteProject(testProjectId);
        } catch (cleanupError) {
          console.warn('Erreur de nettoyage:', cleanupError);
        }
      }
    }

    return results;
  }

  static formatResults(results: TestResult[]): string {
    let report = '🔍 RAPPORT DE TEST SYSTÈME\n';
    report += '═'.repeat(50) + '\n\n';

    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    report += `📊 RÉSUMÉ: ${successCount} succès, ${errorCount} erreurs\n\n`;

    results.forEach((result, index) => {
      report += `${index + 1}. ${result.service}\n`;
      report += `   ${result.message}\n`;
      if (result.status === 'error' && result.details) {
        report += `   Détails: ${result.details.message || JSON.stringify(result.details)}\n`;
      }
      report += '\n';
    });

    return report;
  }

  static async runAndLog(): Promise<void> {
    console.log('🔍 Début des tests système...');
    
    const basicTests = await this.runCompleteTest();
    console.log(this.formatResults(basicTests));

    // Tests CRUD si l'auth fonctionne
    const authWorking = basicTests.some(r => r.service === 'Admin Auth' && r.status === 'success');
    if (authWorking) {
      console.log('🔧 Test CRUD des projets...');
      const crudTests = await this.testProjectsCrud();
      console.log(this.formatResults(crudTests));
    }
  }
}

// Utilitaire pour exporter les résultats
export const downloadTestReport = (results: TestResult[]) => {
  const report = SystemTester.formatResults(results);
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aria-system-test-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Fonction d'export par défaut
export default SystemTester;
