import { useState, useEffect } from 'react';
import { healthApi } from '@/services/api';

interface ApiStatus {
  status: 'connected' | 'disconnected' | 'checking';
  message: string;
  uptime?: number;
  lastCheck?: Date;
}

const ApiStatusNotification = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    status: 'checking',
    message: 'Vérification en cours...'
  });
  const [isVisible, setIsVisible] = useState(false);

  const checkApiHealth = async () => {
    try {
      const response = await healthApi.checkHealth();
      if (response.success && response.data) {
        setApiStatus({
          status: 'connected',
          message: 'Base de données connectée',
          uptime: response.data.uptime,
          lastCheck: new Date()
        });
      } else {
        throw new Error('API non disponible');
      }
    } catch (error) {
      setApiStatus({
        status: 'disconnected',
        message: 'Base de données déconnectée',
        lastCheck: new Date()
      });
    }
  };

  useEffect(() => {
    // Vérification initiale
    checkApiHealth();
    
    // Vérification périodique toutes les 30 secondes
    const interval = setInterval(checkApiHealth, 30000);
    
    // Afficher la notification temporairement
    setIsVisible(true);
    const hideTimer = setTimeout(() => setIsVisible(false), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, []);

  // Ré-afficher la notification en cas de changement de statut
  useEffect(() => {
    setIsVisible(true);
    const hideTimer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(hideTimer);
  }, [apiStatus.status]);

  const getStatusIcon = () => {
    switch (apiStatus.status) {
      case 'connected': return '✅';
      case 'disconnected': return '❌';
      case 'checking': return '🔄';
    }
  };

  const getStatusColor = () => {
    switch (apiStatus.status) {
      case 'connected': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'disconnected': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'checking': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
    }
  };

  const formatUptime = (uptime?: number) => {
    if (!uptime) return '';
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className={`w-4 h-4 rounded-full ${apiStatus.status === 'connected' ? 'bg-green-500' : apiStatus.status === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'} animate-pulse`}
          title="Statut de l'API"
        />
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fadeInUp">
      <div className={`px-4 py-3 rounded-lg border backdrop-blur-sm ${getStatusColor()} max-w-sm`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{getStatusIcon()}</span>
          <span className="font-medium text-sm">{apiStatus.message}</span>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-auto text-xs opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
        
        {apiStatus.uptime && (
          <div className="text-xs opacity-80">
            Serveur actif depuis {formatUptime(apiStatus.uptime)}
          </div>
        )}
        
        {apiStatus.lastCheck && (
          <div className="text-xs opacity-60">
            Dernière vérification: {apiStatus.lastCheck.toLocaleTimeString()}
          </div>
        )}
        
        <div className="mt-2 flex gap-2">
          <button
            onClick={checkApiHealth}
            className="text-xs px-2 py-1 rounded border border-current opacity-70 hover:opacity-100 transition-opacity"
          >
            🔄 Vérifier
          </button>
          {apiStatus.status === 'disconnected' && (
            <button
              onClick={() => window.location.reload()}
              className="text-xs px-2 py-1 rounded border border-current opacity-70 hover:opacity-100 transition-opacity"
            >
              🔄 Recharger
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiStatusNotification;
